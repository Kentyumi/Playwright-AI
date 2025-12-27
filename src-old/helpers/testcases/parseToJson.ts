import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { Testcase, TestStep } from '../models/TestcaseModel';

dotenv.config();

export class TestcaseParser {

  static parseFromTxt(filePath: string): Testcase {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const rawOutput = this.runAI(this.buildPrompt(content));

    const jsonBlock = this.extractJson(rawOutput);
    const parsed = this.safeParse(jsonBlock);

    return {
      testName: parsed.testName || 'Unnamed test',
      steps: Array.isArray(parsed.steps) ? parsed.steps : []
    };
  }

  // =========================
  // AI
  // =========================
  private static runAI(prompt: string): string {
    const cmd = `ollama run llama3 "${prompt.replace(/"/g, '\\"')}"`;
    return execSync(cmd, { encoding: 'utf-8' });
  }

  // =========================
  // Prompt
  // =========================
  private static buildPrompt(content: string): string {
    return `
Extract test steps and return them in JSON format.

Rules:
- Keys MUST be in double quotes
- Values MUST be valid JSON
- steps MUST be an array
- No explanation

Output format example:
{
  "testName": "Example",
  "steps": [
    { "action": "open", "url": "https://example.com" }
  ]
}

Test case:
<<<
${content}
>>>
`;
  }

  // =========================
  // Safe parsing
  // =========================
  private static extractJson(output: string): string {
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('AI output does not contain JSON');
    }
    return output.substring(start, end + 1);
  }

  private static safeParse(jsonLike: string): any {
    try {
      return JSON.parse(jsonLike);
    } catch {
      // 🔒 Last-resort sanitizer (VERY IMPORTANT)
      const sanitized = jsonLike
        .replace(/(\w+)\s*:/g, '"$1":')   // quote keys
        .replace(/'/g, '"');              // single → double quotes

      return JSON.parse(sanitized);
    }
  }
}

// Get file path from command line args or use default
const filePath = process.argv[2] || 'demo-project/testcases/raw/demo.txt';
const projectName = process.env.PROJECT_NAME || 'demo-project'; 

const testcase = TestcaseParser.parseFromTxt(filePath);

// 1️⃣ Log parsed testcase
console.log('Parsed testcase:', JSON.stringify(testcase, null, 2));

// 2️⃣ Save JSON to file
const normalizedName = testcase.testName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-');

const outputJsonPath = path.resolve(
  `${projectName}/testcases/json/${normalizedName}.json`
);

// ensure folder exists
fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });

fs.writeFileSync(
  outputJsonPath,
  JSON.stringify(testcase, null, 2),
  'utf-8'
);

console.log(`✅ JSON saved: ${outputJsonPath}`);
