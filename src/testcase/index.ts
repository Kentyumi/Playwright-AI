import { generateTestcaseJSON } from './generate/generateTestcaseJSON';

const input = process.argv[2];
if (!input) {
  console.error('❌ Missing testcase file');
  process.exit(1);
}

generateTestcaseJSON(
  input,
  'testcases/output.json'
);

console.log('✅ Testcase JSON generated');
