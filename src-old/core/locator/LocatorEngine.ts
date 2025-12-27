// src/core/locator/LocatorEngine.ts
import { Page } from '@playwright/test';
import { OllamaClient } from '../ollama/OllamaClient';

export class LocatorEngine {
    // Tìm locator từ target mô tả trong testcase
    static async find(page: Page, target: string): Promise<string> {
        // 1️⃣ Heuristics DOM
        const basic = await this.basicFind(page, target);
        if (basic) return basic;

        // 2️⃣ AI fallback
        const ai = await this.aiFallback(page, target);
        if (ai) return ai;

        throw new Error(`LocatorEngine: cannot find locator for "${target}"`);
    }

    private static async basicFind(page: Page, target: string): Promise<string | undefined> {
        if (!target) return undefined;
        target = target.toLowerCase();

        // Inputs & textareas
        const inputs = page.locator('input, textarea');
        try {
            await inputs.first().waitFor({ timeout: 5000 });
        } catch { }

        for (const e of await inputs.all()) {
            const attrs = await e.evaluate(el => ({
                name: el.getAttribute('name')?.toLowerCase(),
                id: el.getAttribute('id')?.toLowerCase(),
                placeholder: el.getAttribute('placeholder')?.toLowerCase(),
                aria: el.getAttribute('aria-label')?.toLowerCase(),
            }));

            if (Object.values(attrs).some(v => v && v.includes(target))) {
                return await e.evaluate(el =>
                    el.id ? `#${el.id}` :
                        el.getAttribute('name') ? `[name="${el.getAttribute('name')}"]` :
                            ''
                );
            }
        }

        // Buttons
        const buttons = page.locator('button, input[type="submit"]');
        try {
            await buttons.first().waitFor({ timeout: 5000 });
        } catch { }

        for (const b of await buttons.all()) {
            const text = (
                (await b.innerText()) ||
                (await b.getAttribute('value')) ||
                (await b.getAttribute('aria-label')) ||
                ''
            ).toLowerCase();

            if (text.includes(target)) {
                return `button:has-text("${target}")`;
            }
        }

        return undefined;
    }

    private static async aiFallback(page: Page, target: string): Promise<string | undefined> {
        try {
            const dom = await page.content();
            const suggestion = await OllamaClient.getInstance().askCSSSelector(dom, target);
            if (suggestion) {
                const count = await page.locator(suggestion).count();
                if (count > 0) {
                    console.log(`🧠 AI selector for "${target}": ${suggestion}`);
                    return suggestion;
                }
            }
        } catch (err) {
            console.warn('⚠️ AI fallback failed:', err);
        }
        return undefined;
    }
}
