// src/core/runtime/TestExecutor.ts
import { Page, chromium } from '@playwright/test';
import { Testcase, TestStep } from '../../helpers/models/TestcaseModel';
import { LocatorEngine } from '../locator/LocatorEngine';

export class TestExecutor {
    constructor(private page: Page) { }

    async execute(testcase: Testcase) {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        for (const step of testcase.steps) {
            console.log(`🔹 Executing: ${step.action} ${step.target || ''}`);
            await this.performStep(page, step);
        }

        await browser.close();
    }

    private async performStep(page: Page, step: TestStep) {
        switch (step.action) {
            case 'open': {
                const url = step.url || process.env.BASE_URL;
                if (!url) throw new Error('Open action requires a URL in step.url or BASE_URL in .env');
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                break;
            }

            case 'login': {
                const username = step.username || step.account;
                const password = step.password || step.pass;
                if (!username || !password) throw new Error('Login requires username/account and password/pass');

                const loginSelector = await LocatorEngine.find(page, 'username input');
                await page.fill(loginSelector, username);

                const passSelector = await LocatorEngine.find(page, 'password input');
                await page.fill(passSelector, password);

                const submitSelector = await LocatorEngine.find(page, 'login button');
                await page.click(submitSelector);
                break;
            }

            case 'fill': {
                const selector = await LocatorEngine.find(page, step.target!);
                await page.fill(selector, step.value!);
                break;
            }

            case 'click': {
                const selector = await LocatorEngine.find(page, step.target!);
                await page.click(selector);
                break;
            }

            case 'submit': {
                const selector = await LocatorEngine.find(page, step.target!);
                await page.click(selector);
                break;
            }

            case 'verify': {
                const selector = await LocatorEngine.find(page, step.target!);
                const expectedText = step.value || step.text;
                const text = await page.textContent(selector);
                if (!text?.includes(expectedText!)) {
                    throw new Error(`Verify failed: expected "${expectedText}" but got "${text}"`);
                }
                break;
            }

            default:
                console.warn(`⚠️ Unsupported action: ${step.action}`);
        }
    }
}
