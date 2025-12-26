import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  // Tìm input dựa vào tên, id, placeholder, aria-label
  async findInput(target: string): Promise<Locator> {
    const candidates = await this.page.locator('input, textarea').all();
    for (const el of candidates) {
      const attrs = await el.evaluate(e => ({
        name: e.getAttribute('name'),
        id: e.getAttribute('id'),
        placeholder: e.getAttribute('placeholder'),
        ariaLabel: e.getAttribute('aria-label'),
      }));

      const joined = Object.values(attrs)
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (joined.includes(target.toLowerCase())) {
        return el;
      }
    }
    throw new Error(`Cannot find input matching: ${target}`);
  }

  // Tìm button dựa vào keyword
  async findButton(keywords: string[]): Promise<Locator> {
    const buttons = await this.page.locator('button, input[type="submit"]').all();
    for (const btn of buttons) {
      const text = (
        (await btn.innerText()) ||
        (await btn.getAttribute('value')) ||
        (await btn.getAttribute('aria-label')) ||
        ''
      ).toLowerCase();

      if (keywords.some(k => text.includes(k.toLowerCase()))) {
        return btn;
      }
    }
    throw new Error(`Cannot find button with keywords: ${keywords.join(', ')}`);
  }

  // Perform step generic: fill/click based on action
  async performStep(action: any) {
    switch (action.action) {
      case 'open':
        await this.page.goto(action.url || 'https://www.saucedemo.com');
        break;

      case 'login':
        await (await this.findInput('username')).fill(action.username);
        await (await this.findInput('password')).fill(action.password);
        await (await this.findButton(['login', 'sign in'])).click();
        break;

      case 'addToCart':
        await (await this.findButton([action.item])).click();
        break;

      case 'checkout':
        await (await this.findButton(['checkout'])).click();
        break;

      case 'fillCheckout':
        for (const field in action.fields) {
          await (await this.findInput(field)).fill(action.fields[field]);
        }
        break;

      case 'continue':
      case 'finish':
        await (await this.findButton([action.action])).click();
        break;

      case 'verify':
        const locator = this.page.locator(`text=${action.text}`);
        await locator.waitFor({ timeout: 5000 });
        break;

      default:
        console.warn(`⚠️ Unsupported action: ${action.action}`);
    }
  }
}
