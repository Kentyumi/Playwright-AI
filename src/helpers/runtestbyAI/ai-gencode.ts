import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { TestcaseParser } from '../testcases/parseToJson';
import { PageObjectGenerator } from '../page-generator/PageObjectGenerator';

// Get file path from command line args or use default
const filePath = process.argv[2] || 'product/fptshop/testcases/raw/fptshop-search.txt';

// Parse testcase file
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

// Generate PageObject + test
const testFilePath = PageObjectGenerator.generate(testcase);

// Run test
console.log(`🚀 Running test: ${testFilePath}`);
exec(`npx playwright test "${testFilePath}"`, (err, stdout, stderr) => {
  console.log(stdout);
  if (err) console.error(stderr);
});
