import { Page } from 'playwright';
import fs from 'fs';

export async function captureScreenshot(page: Page, logicalName: string) {
    const fileName = `./reports/${logicalName}_${Date.now()}.png`;
    if (!fs.existsSync('./reports')) fs.mkdirSync('./reports');
    await page.screenshot({ path: fileName });
    console.log(`[INFO] Screenshot captured: ${fileName}`);
}
