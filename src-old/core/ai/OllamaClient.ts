import { execSync } from 'child_process';

export class OllamaClient {
  static ask(prompt: string): string {
    const result = execSync(
      `ollama run llama3 "${prompt.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8' }
    );

    return result.trim();
  }
}
