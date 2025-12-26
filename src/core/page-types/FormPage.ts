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
                await this.submitForm(page);
                break;
        }
    }

    // ✅ UPDATED
    private async fillField(page: Page, action: PageAction) {
        if (!action.target || action.value === undefined) {
            throw new Error('Fill action requires target and value');
        }

        const target = action.target.toLowerCase();
        const inputs = await page.locator('input, textarea').all();

        type Candidate = {
            locator: any;
            score: number;
            meta: Record<string, string | null>;
        };

        const candidates: Candidate[] = [];

        for (const input of inputs) {
            const meta = await input.evaluate(el => {
                const label =
                    el.id &&
                    document.querySelector(`label[for="${el.id}"]`)?.innerHTML.trim();

                return {
                    name: el.getAttribute('name'),
                    id: el.getAttribute('id'),
                    placeholder: el.getAttribute('placeholder'),
                    ariaLabel: el.getAttribute('aria-label'),
                    label,
                    type: el.getAttribute('type'),
                };
            });

            let score = 0;

            for (const value of Object.values(meta)) {
                if (!value) continue;

                const v = value.toLowerCase();
                if (v === target) score += 5;
                else if (v.includes(target)) score += 2;
            }

            if (score > 0) {
                candidates.push({ locator: input, score, meta });
            }
        }

        if (candidates.length === 0) {
            throw new Error(
                `Cannot find input field for target "${action.target}".`
            );
        }

        candidates.sort((a, b) => b.score - a.score);
        await candidates[0].locator.fill(action.value);
    }

    // ✅ OPTIONAL but recommended
    private async submitForm(page: Page) {
        const buttons = await page.locator('button, input[type="submit"]').all();

        for (const btn of buttons) {
            const text = (
                (await btn.innerText()) ||
                (await btn.getAttribute('value')) ||
                (await btn.getAttribute('aria-label')) ||
                ''
            ).toLowerCase();

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
