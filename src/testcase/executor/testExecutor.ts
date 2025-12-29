import { chromium, Page } from 'playwright';
import { resolveLocator } from '../../locator/locatorResolver';
import fs from 'fs';
import { waitForPageReady } from '../../core/utils/wait';

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

    while (!success && retries < 3) {
      try {
        retries++;
        console.log(`   🔁 Attempt ${retries}`);

        // ✅ ALWAYS wait before doing anything
        await waitForPageReady(page);

        switch (step.action) {

          /* ---------- OPEN ---------- */
          case 'open': {
            const url = step.url || step.target;
            if (!url) throw new Error('Open requires url');

            console.log(`   🌍 Navigating to: ${url}`);
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page.waitForLoadState('networkidle');

            console.log(`   ✅ Page loaded`);
            break;
          }

          /* ---------- CLICK ---------- */
          case 'click': {
            const element = step.element || step.target || step.selector;
            if (!element) throw new Error('Click requires element/target');

            console.log(`   🔍 Resolving locator for: "${element}"`);
            const { selector, confidence, strategy } =
              await resolveLocator(page, element);

            console.log(`   🎯 Selector: ${selector}`);
            console.log(`   🧠 Strategy: ${strategy}`);
            console.log(`   📊 Confidence: ${confidence}`);

            const locator = page.locator(selector).first();
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            await locator.click();

            console.log(`   🖱️ Clicked "${element}"`);
            break;
          }

          /* ---------- ENTER ---------- */
          case 'enter': {
            const fields = step.fields || [];
            if (!fields.length) throw new Error('Enter requires fields[]');

            for (const field of fields) {
              console.log(`   🔍 Resolving input: "${field.name}"`);

              const { selector, confidence, strategy } =
                await resolveLocator(page, field.name);

              console.log(`   🎯 Selector: ${selector}`);
              console.log(`   🧠 Strategy: ${strategy}`);
              console.log(`   📊 Confidence: ${confidence}`);

              const locator = page.locator(selector).first();
              await locator.waitFor({ state: 'visible', timeout: 5000 });
              await locator.fill(String(field.value));

              console.log(`   ✍️ Filled "${field.name}" = "${field.value}"`);
            }
            break;
          }

          /* ---------- SELECT ---------- */
          case 'select': {
            const fields = step.fields || [];
            if (!fields.length) throw new Error('Select requires fields[]');

            for (const field of fields) {
              console.log(`   🔍 Resolving select: "${field.name}"`);

              const { selector, confidence, strategy } =
                await resolveLocator(page, field.name);

              console.log(`   🎯 Selector: ${selector}`);
              console.log(`   🧠 Strategy: ${strategy}`);
              console.log(`   📊 Confidence: ${confidence}`);

              const locator = page.locator(selector).first();
              await locator.waitFor({ state: 'visible', timeout: 5000 });
              await locator.selectOption({ label: field.value });

              console.log(`   🔽 Selected "${field.value}"`);
            }
            break;
          }

          /* ---------- LOGIN ---------- */
          case 'login': {
            const username =
              step.username ||
              step.account ||
              step.credentials?.account ||
              step.credentials?.username;

            const password =
              step.password ||
              step.pass ||
              step.credentials?.pass ||
              step.credentials?.password;

            if (!username || !password) {
              throw new Error(
                'Login requires username/account and password/pass'
              );
            }

            console.log(`   🔐 Logging in as "${username}"`);

            const userSel = await resolveLocator(page, 'username input');
            const passSel = await resolveLocator(page, 'password input');
            const btnSel = await resolveLocator(page, 'login button');

            await page.locator(userSel.selector).first().fill(username);
            await page.locator(passSel.selector).first().fill(password);
            await page.locator(btnSel.selector).first().click();

            console.log(`   ✅ Login submitted`);
            break;
          }

          /* ---------- ASSERT ---------- */
          case 'assert':
          case 'verify': {
            const element = step.element || step.target;
            if (!element) throw new Error('Assert requires element');

            console.log(`   🔍 Resolving assert target: "${element}"`);

            const { selector, confidence, strategy } =
              await resolveLocator(page, element);

            console.log(`   🎯 Selector: ${selector}`);
            console.log(`   🧠 Strategy: ${strategy}`);
            console.log(`   📊 Confidence: ${confidence}`);

            const locator = page.locator(selector).first();
            await locator.waitFor({ state: 'visible', timeout: 5000 });

            const text = await locator.innerText();

            if (!text.includes(step.value)) {
              throw new Error(
                `Expected "${step.value}" but got "${text}"`
              );
            }

            console.log(`   ✅ ASSERT PASS`);
            break;
          }

          default:
            console.warn(`   ⚠️ Unsupported action: ${step.action}`);
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
