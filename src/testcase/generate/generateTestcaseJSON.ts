import path from 'path';
import fs from 'fs';
import { TestcaseParser } from '../parse/TestcaseParser';

export class GenerateTestcaseJSON {
  static generate(inputPath: string) {
    const parsed = TestcaseParser.parseFromTxt(inputPath);

    const testName = path.basename(inputPath, '.txt');

    const outputDir = path.resolve(
      process.cwd(),
      'product/simplygo/testcases/json'
    );

    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${testName}.json`);

    const json = {
      testName,
      source: inputPath,
      steps: parsed.lines
    };

    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));

    console.log(`✅ JSON saved: ${outputPath}`);
  }
}
