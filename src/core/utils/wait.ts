import { Page } from '@playwright/test';

export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
}

export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}
