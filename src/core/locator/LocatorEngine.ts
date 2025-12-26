// src/core/locator/LocatorEngine.ts
import { Page } from '@playwright/test';
import { AISelectorEngine } from '../../core/locator/AISelectorEngine';

export class LocatorEngine {
    // Tìm locator từ target mô tả trong testcase
    static async find(page: Page, target: string): Promise<string> {
        if (!target) throw new Error('LocatorEngine: target is undefined');

        // 1️⃣ Heuristics DOM
        const basic = await this.basicFind(page, target);
        if (basic) return basic;

        // 2️⃣ AI fallback
        const ai = await this.aiFallback(page, target);
        if (ai) return ai;

        throw new Error(`LocatorEngine: cannot find locator for "${target}"`);
    }

    private static async basicFind(page: Page, target: string): Promise<string | undefined> {
        target = (target || '').toLowerCase();
        if (!target) return undefined;

        // inputs, buttons, links heuristics
        const inputs = await page.locator('input, textarea').all();
        for (const e of inputs) {
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

        const buttons = await page.locator('button, input[type="submit"]').all();
        for (const b of buttons) {
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
            console.warn(`⚠️ AI fallback skipped: MCP CLI not installed. Target="${target}"`);
            return undefined; // fallback về basicFind hoặc alert tester
        } catch (err) {
            console.warn('⚠️ AI fallback failed:', err);
            return undefined;
        }
    }


}
