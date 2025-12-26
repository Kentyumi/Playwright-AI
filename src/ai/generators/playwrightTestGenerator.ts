import fs from 'fs';
import path from 'path';
import { Testcase, TestStep } from '../models/TestcaseModel';


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
import { test, expect } from '@playwright/test';

test('${testcase.testName}', async ({ page }) => {
${testcase.steps.map(step => this.buildStep(step)).join('\n')}
});
`;
  }

  private static buildStep(step: TestStep): string {
    switch (step.action) {
      case 'open':
        return `  await page.goto('${step.url}');`;

      case 'login':
        return `
  await page.fill('#user-name', '${step.username}');
  await page.fill('#password', '${step.password}');
  await page.click('#login-button');
        `;

      case 'addToCart':
        return `
  await page.click('text=${step.item}');
  await page.click('button:has-text("Add to cart")');
        `;

      case 'checkout':
        return `
  await page.click('.shopping_cart_link');
  await page.click('#checkout');
        `;

      default:
        return `  // ⚠️ Unsupported action: ${step.action}`;
    }
  }

  private static normalize(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
