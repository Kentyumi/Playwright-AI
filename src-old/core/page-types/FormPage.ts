import { Page } from '@playwright/test';
import { BasePageContract } from '../contracts/BasePageContract';
import { PageAction } from '../contracts/PageAction';
import { LocatorEngine } from '../locator/LocatorEngine';

export class FormPage implements BasePageContract {
  readonly name = 'FormPage';

  canHandle(action: PageAction): boolean {
    return ['fill', 'submit'].includes(action.action);
  }

  async perform(page: Page, action: PageAction): Promise<void> {
    switch(action.action) {
      case 'fill':
        await this.fillField(page, action.target!, action.value!);
        break;
      case 'submit':
        await this.submitForm(page);
        break;
    }
  }

  private async fillField(page: Page, target: string, value: string) {
    const selector = await LocatorEngine.find(page, target);
    if (!selector) throw new Error(`No selector found for: ${target}`);
    await page.fill(selector, value);
  }

  private async submitForm(page: Page) {
    const selector = await LocatorEngine.find(page, 'submit button');
    if (!selector) throw new Error('No submit button found');
    await page.click(selector);
  }
}
