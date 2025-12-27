import fs from 'fs';
import path from 'path';
import { AISuggestion } from './AISuggestion';

const CACHE_DIR = '.ai-cache';

export class AICache {
  static get(key: string): AISuggestion | null {
    const file = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  static set(key: string, value: AISuggestion) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(CACHE_DIR, `${key}.json`),
      JSON.stringify(value, null, 2)
    );
  }
}
