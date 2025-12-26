import { Page } from '@playwright/test';
import { TestStep } from '../../helpers/models/TestcaseModel';
import { LocatorStrategy } from './LocatorStrategy';

export class LocatorEngine {

  // Core method: tự động perform action
  static async performAction(page: Page, step: TestStep) {
    // 1. Lấy selector từ AI / heuristic
    const selector = await LocatorStrategy.getSelector(page, step);

    switch (step.action) {
      case 'click':
      case 'add_to_cart':
      case 'checkout':
        await page.locator(selector).click();
        break;

      case 'fill':
      case 'login':
        if (!step.value) throw new Error('Fill action requires value');
        await page.locator(selector).fill(step.value);
        break;

      case 'verify':
        const text = await page.locator(selector).innerText();
        if (!text.includes(step.text)) {
          throw new Error(`Verification failed. Expected: ${step.text}, Got: ${text}`);
        }
        break;

      default:
        throw new Error(`Unsupported action: ${step.action}`);
    }
  }
}
