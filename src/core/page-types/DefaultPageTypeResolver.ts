import { Page } from '@playwright/test';
import { PageAction } from '../contracts/PageAction';
import { BasePageContract } from '../contracts/BasePageContract';
import { FormPage } from './FormPage';

export class DefaultPageTypeResolver {
  private pageTypes: BasePageContract[] = [
    new FormPage(),
    // ListPage, ModalPage will be added later
  ];

  async resolve(page: Page, action: PageAction): Promise<void> {
    const handler = this.pageTypes.find(p => p.canHandle(action));

    if (!handler) {
      throw new Error(`No PageType can handle action: ${action.action}`);
    }

    await handler.perform(page, action);
  }
}
