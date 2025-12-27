import { Page } from 'playwright';
import fs from 'fs';

export async function suggestLocator(page: Page, logicalName: string): Promise<string> {
    // capture DOM snapshot
    const domSnapshot = await page.content();
    fs.writeFileSync(`./reports/DOM_${logicalName}.html`, domSnapshot);
    console.log(`[AI] Suggesting locator for "${logicalName}"`);

    // TODO: tích hợp GPT-4/5 / LLM call
    // giả lập AI gợi locator
    return `text=${logicalName}`;
}
