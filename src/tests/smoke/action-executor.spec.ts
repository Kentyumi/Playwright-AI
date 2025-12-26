import { test } from '@playwright/test';
import { TestExecutor } from '../../core/runtime/TestExecutor';

test('Action executor smoke test', async ({ page }) => {
  const executor = new TestExecutor();

  await executor.execute(page, [
    { action: 'open', value: 'https://www.saucedemo.com' },
    { action: 'fill', target: 'username', value: 'standard_user' },
    { action: 'fill', target: 'password', value: 'secret_sauce' },
    { action: 'submit' }
  ]);
});
