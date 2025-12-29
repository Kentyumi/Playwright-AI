
import dotenv from 'dotenv';
import { TestExecutor } from '../executor/testExecutor';

dotenv.config();

/* npx ts-node src/testcase/run-test/runner.ts --gen product/simplygo/testcases/raw/simplygo.txt
npx ts-node src/testcase/run-test/runner.ts --run product/simplygo/testcases/generated/simplygo.json
npx ts-node src/testcase/run-test/runner.ts --gen-run product/simplygo/testcases/raw/simplygo.txt
*/


(async () => {
  const jsonFile = process.argv[2];

  if (!jsonFile) {
    console.error('❌ Missing testcase JSON file');
    console.log('Usage: ts-node run.ts <testcase.json>');
    process.exit(1);
  }

  const executor = new TestExecutor();
  await executor.runTestFromJSON(jsonFile);
})();
