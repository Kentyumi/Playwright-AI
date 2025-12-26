import { Page } from '@playwright/test';
import { PageAction } from '../contracts/PageAction';
import { DefaultPageTypeResolver } from '../page-types/DefaultPageTypeResolver';

export class TestExecutor {
  private resolver = new DefaultPageTypeResolver();

  async execute(page: Page, actions: PageAction[]) {
    for (const action of actions) {
      await this.resolver.resolve(page, action);
    }
  }
}
