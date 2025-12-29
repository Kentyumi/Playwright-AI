
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

/* npx ts-node src/helpers/run-test/runner.ts --gen product/simplygo/testcases/raw/simplygo.txt
npx ts-node src/helpers/run-test/runner.ts --run product/simplygo/testcases/generated/simplygo.json
npx ts-node src/helpers/run-test/runner.ts --gen-run product/simplygo/testcases/raw/simplygo.txt
*/

async function main() {
  const args = process.argv.slice(2);

  const mode =
    args.includes('--gen-run')
      ? 'gen-run'
      : args.includes('--gen')
        ? 'gen'
        : 'run';

  const fileArg = args.find(a => !a.startsWith('--'));

  if (!fileArg) {
    throw new Error(
      '❌ Missing testcase file path. Usage:\n' +
      '  --gen <file.txt>\n' +
      '  --run <file.json>\n' +
      '  --gen-run <file.txt>'
    );
  }

  const absPath = path.resolve(fileArg);

  console.log(`📂 Mode: ${mode}`);
  console.log(`📄 Input file: ${absPath}`);

  let testcase;

  /* ---------- GEN JSON ---------- */
  if (mode === 'gen' || mode === 'gen-run') {
    if (!fs.existsSync(absPath)) {
      throw new Error(`❌ File not found: ${absPath}`);
    }

    console.log('🧠 Generating testcase JSON...');
    testcase = ParseToJson.TestcaseParser.parseFromTxt(absPath);

    const outPath = absPath
      .replace('/raw/', '/generated/')
      .replace('.txt', '.json');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(testcase, null, 2));

    console.log(`✅ Testcase JSON saved: ${outPath}`);

    if (mode === 'gen') return;

    testcase = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
  }

  /* ---------- RUN ---------- */
  if (mode === 'run') {
    testcase = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
  }

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const executor = new TestExecutor(page);
    await executor.execute(testcase);
    console.log('✅ Runner completed successfully.');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Runner failed:', err.message || err);
  process.exit(1);
});
