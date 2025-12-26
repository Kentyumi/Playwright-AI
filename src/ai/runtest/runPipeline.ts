import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { TestcaseParser } from '../testcases/testcaseParser';
import { PlaywrightTestGenerator } from '../generators/playwrightTestGenerator';

const filePath = process.argv[2] || 'src/ai/testcases/demo.txt';

// 1️⃣ Parse testcase (txt or json)
const ext = path.extname(filePath);
let testcase;

if (ext === '.txt') {
  testcase = TestcaseParser.parseFromTxt(filePath);
} else if (ext === '.json') {
  testcase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} else {
  throw new Error('Unsupported file type: ' + ext);
}

console.log('✅ Testcase parsed:', JSON.stringify(testcase, null, 2));

// 2️⃣ Generate Playwright test
PlaywrightTestGenerator.generate(testcase);

// 3️⃣ Run the generated test automatically
const testFilePath = path.resolve('src/tests/generated', `${testcase.testName}.spec.ts`);
console.log(`🚀 Running test: ${testFilePath}`);

exec(`npx playwright test ${testFilePath}`, (err, stdout, stderr) => {
  console.log(stdout);
  if (err) console.error(stderr);
});
