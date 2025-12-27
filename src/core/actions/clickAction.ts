export async function smartClick(page, selector: string) {
  const locator = page.locator(selector).first();

  await locator.waitFor({ state: 'visible', timeout: 5000 });
  await Promise.all([
    page.waitForLoadState('domcontentloaded').catch(() => {}),
    locator.click()
  ]);
}