import { TestcaseParser } from '../testcases/testcaseParser';
import { PlaywrightTestGenerator } from '../generators/playwrightTestGenerator';

const filePath = process.argv[2] || 'src/ai/testcases/demo.txt';

const testcase = TestcaseParser.parseFromTxt(filePath);

console.log('Parsed testcase:', JSON.stringify(testcase, null, 2));

PlaywrightTestGenerator.generate(testcase);


