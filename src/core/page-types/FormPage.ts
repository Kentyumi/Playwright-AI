import { Page } from '@playwright/test';
import { BasePageContract } from '../contracts/BasePageContract';
import { PageAction } from '../contracts/PageAction';

export class FormPage implements BasePageContract {
    readonly name = 'FormPage';

    canHandle(action: PageAction): boolean {
        return ['fill', 'submit'].includes(action.action);
    }

    async perform(page: Page, action: PageAction): Promise<void> {
        switch (action.action) {
            case 'fill':
                await this.fillField(page, action);
                break;

            case 'submit':
                await this.submitForm(page, action);
                break;
        }
    }

    private async fillField(page: Page, action: PageAction) {
        if (!action.target || !action.value) {
            throw new Error('Fill action requires target and value');
        }

        const candidates = await page.locator('input, textarea').all();

        for (const input of candidates) {
            const attrs = await input.evaluate(el => ({
                name: el.getAttribute('name'),
                id: el.getAttribute('id'),
                placeholder: el.getAttribute('placeholder'),
                ariaLabel: el.getAttribute('aria-label'),
                type: el.getAttribute('type'),
            }));

            const joined = Object.values(attrs)
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            if (joined.includes(action.target.toLowerCase())) {
                await input.fill(action.value);
                return;
            }
        }

        throw new Error(`Cannot find input field matching target: ${action.target}`);
    }


    private async submitForm(page: Page) {
        const buttons = await page.locator('button, input[type="submit"]').all();

        for (const btn of buttons) {
            const text = (await btn.innerText()).toLowerCase();
            if (
                text.includes('login') ||
                text.includes('submit') ||
                text.includes('sign in') ||
                text.includes('continue')
            ) {
                await btn.click();
                return;
            }
        }

        throw new Error('No submit button found on form');
    }

}
