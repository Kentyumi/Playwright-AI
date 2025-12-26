import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export class TestcaseParser {
  static parseFromTxt(filePath: string): any {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const rawOutput = this.runAI(this.buildMainPrompt(content));

    try {
      return JSON.parse(this.extractJson(rawOutput));
    } catch (e) {
      // 🔁 Fallback: ask AI to fix JSON
      const fixedOutput = this.runAI(
        this.buildFixJsonPrompt(rawOutput)
      );

      return JSON.parse(this.extractJson(fixedOutput));
    }
  }

  // =========================
  // AI Calls
  // =========================
  private static runAI(prompt: string): string {
    const command = `ollama run llama3 "${prompt.replace(/"/g, '\\"')}"`;

    return execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
  }

  // =========================
  // Prompts
  // =========================
  private static buildMainPrompt(content: string): string {
    return `
You are a QA automation AI.

Convert the following manual test case into VALID JSON.

STRICT REQUIREMENTS:
- JSON keys MUST be in double quotes
- Output MUST be parsable by JSON.parse
- No explanation, no markdown
- No trailing commas

Manual Test Case:
<<<
${content}
>>>
`;
  }

  private static buildFixJsonPrompt(brokenJson: string): string {
    return `
You are a JSON fixer.

Fix the following content so that it becomes VALID JSON.

Rules:
- Output ONLY fixed JSON
- Use double quotes for all keys
- No explanation

Broken content:
<<<
${brokenJson}
>>>
`;
  }

  // =========================
  // Utils
  // =========================
  private static extractJson(output: string): string {
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON found in AI output');
    }
    return output.substring(start, end + 1);
  }
}
