import { TestcaseParser } from '../ai/testcases/testcaseParser';

const result = TestcaseParser.parseFromTxt(
  'src/ai/testcases/login_checkout_success.txt'
);

console.log('=== AI PARSED JSON ===');
console.log(JSON.stringify(result, null, 2));
