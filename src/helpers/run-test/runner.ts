// src/helpers/run-test/runner.ts
import * as ParseToJson from '../../helpers/testcases/parseToJson';
import { TestExecutor } from '../../core/runtime/TestExecutor';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function main() {
  const filePath = process.argv[2] || 'testcases/demo.txt';
  console.log(`📂 Running test for: ${filePath}`);

  // 1️⃣ Parse testcase JSON
  const testcase = ParseToJson.TestcaseParser.parseFromTxt(filePath);

  if (!testcase || !testcase.steps || testcase.steps.length === 0) {
    console.error('❌ No steps found in testcase.');
    process.exit(1);
  }

  // 2️⃣ Launch browser and page
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 3️⃣ Execute testcase
    const executor = new TestExecutor(page);
    await executor.execute(testcase);

    console.log('✅ Runner completed successfully.');
  } catch (err) {
    console.error('❌ Runner failed:', err);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Runner crashed:', err);
  process.exit(1);
});
