
import { test, expect } from '@playwright/test';

test('Login and checkout successfully', async ({ page }) => {
  await page.goto('https://saucedemo.com');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
        
  // ⚠️ Unsupported action: verify
  // ⚠️ Unsupported action: add
  // ⚠️ Unsupported action: add
  await page.goto('undefined');
  // ⚠️ Unsupported action: click
  // ⚠️ Unsupported action: fill
  // ⚠️ Unsupported action: continue
  // ⚠️ Unsupported action: finish
  // ⚠️ Unsupported action: verify
});
