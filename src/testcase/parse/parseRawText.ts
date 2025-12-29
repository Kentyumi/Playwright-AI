import fs from 'fs';

export function parseRawText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}
