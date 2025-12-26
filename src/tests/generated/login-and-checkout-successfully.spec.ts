
import { test } from '@playwright/test';
import { LoginPage } from '../../../demo-project/pages/loginpage.page';
import { GenericPage } from '../../../demo-project/pages/genericpage.page';
import { CheckoutPage } from '../../../demo-project/pages/checkoutpage.page';

test('Login and checkout successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const genericPage = new GenericPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.open();
  await loginPage.login();
  await genericPage.verify();
  await genericPage.add();
  await genericPage.add();
  await loginPage.open();
  await genericPage.click();
  await genericPage.fill();
  await checkoutPage.continue();
  await checkoutPage.finish();
  await genericPage.verify();
});
