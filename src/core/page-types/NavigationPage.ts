import { Page } from '@playwright/test';
import { BasePageContract } from '../contracts/BasePageContract';
import { PageAction } from '../contracts/PageAction';

export class NavigationPage implements BasePageContract {
  readonly name = 'NavigationPage';

  canHandle(action: PageAction): boolean {
    return action.action === 'open';
  }

  async perform(page: Page, action: PageAction): Promise<void> {
    if (!action.value) {
      throw new Error('Open action requires a URL in value');
    }

    await page.goto(action.value);
  }
}
