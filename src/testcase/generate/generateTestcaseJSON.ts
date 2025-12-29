import { parseRawText } from '../parse/parseRawText';
import { normalizeSteps } from '../normalize/normalizeSteps';
import { Testcase } from '../models/TestcaseModel';
import fs from 'fs';

export function generateTestcaseJSON(
  input: string,
  output: string
) {
  const raw = parseRawText(input);
  const steps = normalizeSteps(raw);

  const testcase: Testcase = {
    testName: input,
    steps
  };

  fs.writeFileSync(output, JSON.stringify(testcase, null, 2));
}
