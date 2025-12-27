import { runTestFromJSON } from './executor/testExecutor';

const testFile = process.argv[2];

if (!testFile) {
  console.error('❌ Please provide test JSON file');
  process.exit(1);
}

(async () => {
  console.log('🚀 Running test:', testFile);
  await runTestFromJSON(testFile);
})();
