import { GenerateTestcaseJSON } from '../generate/generateTestcaseJSON';

/* Generate a JSON test case from a text file */

/* # 1. TXT → JSON
npx ts-node src/testcase/runner/generate.ts \
product/simplygo/testcases/raw/simplygo.txt
 */

(async () => {
    const input = process.argv[2];

    if (!input) {
        console.error('❌ Missing input file');
        console.log('Usage: ts-node generate.ts <testcase.txt>');
        process.exit(1);
    }

    GenerateTestcaseJSON.generate(input);
})();
