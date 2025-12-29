import { TestExecutor } from '../core/testcase/executor/testExecutor';

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
