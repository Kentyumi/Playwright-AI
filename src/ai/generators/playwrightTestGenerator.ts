import fs from 'fs';
import path from 'path';
import { Testcase } from '../models/TestcaseModel';

export class PlaywrightTestGenerator {

  static generate(testcase: Testcase) {
    const content = this.buildTest(testcase);

    const outputPath = path.resolve(
      `tests/generated/${this.normalize(testcase.testName)}.spec.ts`
    );

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content, 'utf-8');

    console.log(`✅ Generated test: ${outputPath}`);
  }

  private static buildTest(testcase: Testcase): string {
    return `
import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';

test('${testcase.testName}', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckoutPage(page);

${this.buildSteps(testcase)}
});
`;
  }

  private static buildSteps(testcase: Testcase): string {
    return testcase.steps.map(step => {
      switch (step.action) {

        case 'open':
          return `  await loginPage.open('${step.url}');`;

        case 'login':
          return `  await loginPage.login('${step.username}', '${step.password}');`;

        case 'addToCart':
          return `  await checkoutPage.addItemToCart('${step.item}');`;

        case 'checkout':
          return `  await checkoutPage.completeCheckout();`;

        default:
          return `  // ⚠️ Unsupported action: ${JSON.stringify(step)}`;
      }
    }).join('\n');
  }

  private static normalize(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
