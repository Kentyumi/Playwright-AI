import { chromium, Page } from 'playwright';
import { resolveLocator } from '../locator/locatorResolver';
import fs from 'fs';

export async function runTestFromJSON(file: string) {
  const testSteps = JSON.parse(fs.readFileSync(file, 'utf-8'));

  console.log('📘 Loaded test:', testSteps.testName);
  console.log('🧪 Total steps:', testSteps.steps.length);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (let i = 0; i < testSteps.steps.length; i++) {
    const step = testSteps.steps[i];
    let success = false;
    let retries = 0;

    console.log(`\n▶️ STEP ${i + 1}: ${step.action.toUpperCase()}`);

    while (!success && retries <= 2) {
      try {
        retries++;
        console.log(`   🔁 Attempt ${retries}`);

        switch (step.action) {
          /* ---------- OPEN ---------- */
          case 'open':
            console.log(`   🌍 Navigating to: ${step.url}`);
            await page.goto(step.url, { waitUntil: 'domcontentloaded' });
            console.log(`   ✅ Page loaded`);
            break;

          /* ---------- CLICK ---------- */
          case 'click': {
            console.log(`   🔍 Resolving locator for: "${step.element}"`);
            const { selector, confidence, strategy } =
              await resolveLocator(page, step.element);

            console.log(`   🎯 Selector: ${selector}`);
            console.log(`   🧠 Strategy: ${strategy}`);
            console.log(`   📊 Confidence: ${confidence}`);

            const locator = page.locator(selector).first();

            console.log(`   ⏳ Waiting for element to be visible...`);
            await locator.waitFor({ state: 'visible', timeout: 5000 });

            await locator.click();
            console.log(`   🖱️ Clicked "${step.element}"`);
            break;
          }

          /* ---------- ENTER ---------- */
          case 'enter':
            for (const field of step.fields) {
              console.log(`   🔍 Resolving input: "${field.name}"`);
              const { selector, confidence, strategy } =
                await resolveLocator(page, field.name);

              console.log(`   🎯 Selector: ${selector}`);
              console.log(`   🧠 Strategy: ${strategy}`);
              console.log(`   📊 Confidence: ${confidence}`);

              await page.locator(selector).fill(field.value.toString());
              console.log(`   ✍️ Filled "${field.name}" = "${field.value}"`);
            }
            break;

          /* ---------- SELECT ---------- */
          case 'select':
            for (const field of step.fields) {
              console.log(`   🔍 Resolving select: "${field.name}"`);
              const { selector, confidence, strategy } =
                await resolveLocator(page, field.name);

              console.log(`   🎯 Selector: ${selector}`);
              console.log(`   🧠 Strategy: ${strategy}`);
              console.log(`   📊 Confidence: ${confidence}`);

              await page
                .locator(selector)
                .selectOption({ label: field.value });

              console.log(`   🔽 Selected "${field.value}"`);
            }
            break;

          /* ---------- LOGIN (STATIC) ---------- */
          case 'login':
            console.log(`   🔐 Logging in as "${step.username}"`);
            await page.fill('input[name="username"]', step.username);
            await page.fill('input[name="password"]', step.password);
            await page.click('button:has-text("Login")');
            console.log(`   ✅ Login submitted`);
            break;

          /* ---------- ASSERT ---------- */
          case 'assert': {
            console.log(`   🔍 Resolving assert target: "${step.element}"`);
            const { selector, confidence, strategy } =
              await resolveLocator(page, step.element);

            console.log(`   🎯 Selector: ${selector}`);
            console.log(`   🧠 Strategy: ${strategy}`);
            console.log(`   📊 Confidence: ${confidence}`);

            const text = await page.locator(selector).innerText();

            if (!text.includes(step.value)) {
              throw new Error(
                `Expected "${step.value}" but got "${text}"`
              );
            }

            console.log(`   ✅ ASSERT PASS: "${step.value}" found`);
            break;
          }

          default:
            console.warn(`   ⚠️ Unknown action: ${step.action}`);
        }

        success = true;
      } catch (e: any) {
        console.log(
          `   ❌ ERROR (attempt ${retries}): ${
            e instanceof Error ? e.message : e
          }`
        );

        if (retries >= 3) {
          console.log(`   🛑 Step FAILED after ${retries} attempts`);
          await captureDebugArtifacts(page, i + 1);
          throw e;
        }

        console.log(`   🔄 Retrying step...`);
      }
    }
  }

  console.log('\n🎉 TEST FINISHED SUCCESSFULLY');
  await browser.close();
}

/* ---------- DEBUG HELPERS ---------- */

async function captureDebugArtifacts(page: Page, stepIndex: number) {
  const dir = `./debug/step-${stepIndex}`;
  fs.mkdirSync(dir, { recursive: true });

  await page.screenshot({
    path: `${dir}/screenshot.png`,
    fullPage: true
  });

  const html = await page.content();
  fs.writeFileSync(`${dir}/dom.html`, html);

  console.log(`   🧩 Debug artifacts saved to ${dir}`);
}
