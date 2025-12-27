import fs from 'fs';

export interface LocatorCacheEntry {
  selector: string;
  confidence: number;
  strategy: string;
  lastUpdated: string;
}

const CACHE_FILE = './reports/locatorCache.json';
let locatorCache: Record<string, LocatorCacheEntry> = {};

if (fs.existsSync(CACHE_FILE)) {
  locatorCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
}

/* ---------- GET ---------- */
export function getCachedLocator(logicalName: string): LocatorCacheEntry | undefined {
  return locatorCache[logicalName];
}

/* ---------- SET / AUTO-HEAL UPDATE ---------- */
export function setCachedLocator(
  logicalName: string,
  selector: string,
  confidence: number,
  strategy: string
) {
  locatorCache[logicalName] = {
    selector,
    confidence,
    strategy,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(CACHE_FILE, JSON.stringify(locatorCache, null, 2));

  console.log(`   💾 [AUTO-HEAL] Cache updated for "${logicalName}"`);
}
