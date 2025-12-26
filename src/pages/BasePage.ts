import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
