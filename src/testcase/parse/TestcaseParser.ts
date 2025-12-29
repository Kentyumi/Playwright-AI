import fs from 'fs';
import path from 'path';

export class TestcaseParser {
  static parseFromTxt(inputPath: string) {
    console.log('📄 Input testcase:', inputPath);

    // ✅ resolve relative → absolute
    const filePath = path.isAbsolute(inputPath)
      ? inputPath
      : path.resolve(process.cwd(), inputPath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Testcase file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    const lines = content
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    return {
      filePath,
      rawContent: content,
      lines
    };

  }
}
