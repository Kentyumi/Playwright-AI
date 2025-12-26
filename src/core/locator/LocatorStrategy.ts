import { Page } from '@playwright/test';
import { TestStep } from '../../helpers/models/TestcaseModel';

export class LocatorStrategy {

  // Lấy selector từ step + DOM
  static async getSelector(page: Page, step: TestStep): Promise<string> {
    // Heuristic placeholder: tìm input/button dựa trên placeholder, name, text
    const candidates = await page.locator('input, textarea, button, a').all();

    for (const el of candidates) {
      const attrs = await el.evaluate((e: any) => ({
        id: e.id,
        name: e.name,
        placeholder: e.placeholder,
        text: e.innerText,
        ariaLabel: e.getAttribute('aria-label')
      }));

      const joined = Object.values(attrs)
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (step.target && joined.includes(step.target.toLowerCase())) {
        return await el.evaluate((e: any) => e.tagName === 'INPUT' ? `#${e.id || e.name}` : `text=${e.innerText}`);
      }

      if (step.action === 'login' && joined.includes('password')) {
        return `#${attrs.id || attrs.name}`;
      }

      if (step.action === 'add_to_cart' && joined.includes(step.product?.toLowerCase() || '')) {
        return `text=${step.product}`;
      }
    }

    // fallback: trả selector placeholder (sẽ dùng AI refine sau)
    return `body`;
  }
}
