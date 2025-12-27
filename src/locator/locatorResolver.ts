import { Page } from 'playwright';
import { getCachedLocator, setCachedLocator } from './cache';

type LocatorResult = {
  selector: string;
  confidence: number;
  strategy: string;
};

/* ---------- PAGE SIGNATURE ---------- */
async function getPageSignature(page: Page): Promise<string> {
  return await page.evaluate(() =>
    document.title + '|' + location.pathname
  );
}

/* ---------- MAIN RESOLVER ---------- */
export async function resolveLocator(
  page: Page,
  logicalName: string
): Promise<LocatorResult> {

  const pageSignature = await getPageSignature(page);
  const cacheKey = `${pageSignature}::${logicalName}`;

  /* =========================================================
     1️⃣ CACHE FIRST (FAST PATH)
     ========================================================= */
  const cached = getCachedLocator(cacheKey);
  if (cached) {
    console.log(
      `🧠 [CACHE HIT] ${logicalName} → ${cached.selector} (${cached.strategy})`
    );
    return {
      selector: cached.selector,
      confidence: cached.confidence,
      strategy: 'cache'
    };
  }

  /* =========================================================
     2️⃣ HEURISTIC: BUTTON BY TEXT
     ========================================================= */
  const buttonTextSelector = `button:has-text("${logicalName}")`;
  const buttonLocator = page.locator(buttonTextSelector).first();

  if (await buttonLocator.count() > 0) {
    try {
      await buttonLocator.waitFor({ state: 'visible', timeout: 2000 });

      console.log(`🧠 [HEURISTIC] button-text`);
      const confidence = 1.0;
      const strategy = 'button-text';

      setCachedLocator(cacheKey, buttonTextSelector, confidence, strategy);

      return {
        selector: buttonTextSelector,
        confidence,
        strategy
      };
    } catch {
      console.log(`⚠️ [HEURISTIC] Found but not usable`);
    }
  }

  /* =========================================================
     3️⃣ AI FALLBACK (AUTO-HEAL)
     ========================================================= */
  console.log(`🤖 [AI FALLBACK] resolving "${logicalName}"`);

  // ⚠️ giả lập AI – sau này thay bằng GPT / DOM analysis
  const aiSelector = `text=${logicalName}`;
  const aiConfidence = 0.7;
  const aiStrategy = 'ai-text';

  const aiLocator = page.locator(aiSelector).first();

  try {
    await aiLocator.waitFor({ state: 'visible', timeout: 3000 });

    setCachedLocator(cacheKey, aiSelector, aiConfidence, aiStrategy);

    console.log(`🤖 [AI SUCCESS] selector healed & cached`);

    return {
      selector: aiSelector,
      confidence: aiConfidence,
      strategy: aiStrategy
    };
  } catch {
    throw new Error(`❌ AUTO-HEAL FAILED for "${logicalName}"`);
  }
}
