import { Page, chromium } from '@playwright/test';
import { Testcase, TestStep } from '../../helpers/models/TestcaseModel';
import { LocatorEngine } from '../locator/LocatorEngine';

export class TestExecutor {
  constructor(private page: Page) {}

  async execute(testcase: Testcase) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    for (const step of testcase.steps) {
      console.log(`🔹 Executing: ${step.action} ${step.target || step.element || ''}`);
      await this.performStep(page, step);
    }

    await browser.close();
  }

  private async performStep(page: Page, step: TestStep) {
    switch (step.action.toLowerCase()) {
      case 'open': {
        const url = step.target || step.url || process.env.BASE_URL;
        if (!url) throw new Error('Open action requires a URL in target or url or BASE_URL');
        await page.goto(url);
        break;
      }

      case 'login': {
        // linh hoạt lấy username/password từ nhiều key
        const account = step.credentials?.account ?? step.account ?? step.username ?? step.value;
        const pass = step.credentials?.pass ?? step.pass ?? step.password;

        if (!account || !pass) {
          throw new Error('Login requires username/account and password/pass');
        }

        const usernameSelector = await LocatorEngine.find(page, 'username input');
        await page.fill(usernameSelector, account);

        const passwordSelector = await LocatorEngine.find(page, 'password input');
        await page.fill(passwordSelector, pass);

        const submitSelector = await LocatorEngine.find(page, 'login button');
        await page.click(submitSelector);
        break;
      }

      case 'fill': {
        const target = step.target || step.element;
        const value = step.value ?? step.text ?? step.input;
        if (!target || value === undefined) throw new Error('Fill action requires target/element and value/text/input');

        const selector = await LocatorEngine.find(page, target);
        await page.fill(selector, value);
        break;
      }

      case 'click': {
        const target = step.target || step.element || step.value;
        if (!target) throw new Error('Click action requires target/element/value');

        const selector = await LocatorEngine.find(page, target);
        await page.click(selector);
        break;
      }

      case 'submit': {
        const target = step.target || step.element;
        if (!target) throw new Error('Submit action requires target/element');

        const selector = await LocatorEngine.find(page, target);
        await page.click(selector);
        break;
      }

      case 'verify': {
        const target = step.target || step.element;
        const expected = step.value ?? step.text ?? step.expect;
        if (!target || expected === undefined) throw new Error('Verify action requires target/element and value/text/expect');

        const selector = await LocatorEngine.find(page, target);
        const text = await page.textContent(selector);
        if (!text?.includes(expected)) {
          throw new Error(`Verify failed: expected "${expected}" but got "${text}"`);
        }
        break;
      }

      default:
        console.warn(`⚠️ Unsupported action: ${step.action}`);
    }
  }
}
