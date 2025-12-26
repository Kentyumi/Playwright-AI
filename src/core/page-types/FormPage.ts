import { Page } from '@playwright/test';
import { BasePageContract } from '../contracts/BasePageContract';
import { PageAction } from '../contracts/PageAction';

export class FormPage implements BasePageContract {
  readonly name = 'FormPage';

  canHandle(action: PageAction): boolean {
    return ['fill', 'submit'].includes(action.action);
  }

  async perform(page: Page, action: PageAction): Promise<void> {
    switch (action.action) {
      case 'fill':
        await this.fillField(page, action);
        break;

      case 'submit':
        await this.submitForm(page, action);
        break;
    }
  }

  private async fillField(page: Page, action: PageAction) {
    // implemented later by AI logic
  }

  private async submitForm(page: Page, action: PageAction) {
    // implemented later by AI logic
  }
}
