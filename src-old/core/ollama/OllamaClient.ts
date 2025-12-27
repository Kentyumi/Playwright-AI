// src/core/ollama/OllamaClient.ts
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class OllamaClient {
  private static instance: OllamaClient;

  private constructor() {
    // private constructor → singleton
  }

  public static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient();
    }
    return OllamaClient.instance;
  }

  /**
   * Gọi Ollama local hoặc API Qwen để generate CSS selector
   */
  public async askCSSSelector(dom: string, target: string): Promise<string | undefined> {
    try {
      // Đây là pseudo-code / placeholder. Bạn có thể đổi thành API thật
      const prompt = `Find the best CSS selector for element described as "${target}" in this HTML:\n${dom}`;
      
      // ví dụ chạy command-line Ollama (nếu dùng local CLI)
      const { stdout } = await execAsync(`echo "${prompt}" | ollama generate --model llama2`);
      const selector = stdout.trim();

      return selector || undefined;
    } catch (e) {
      console.error('OllamaClient error:', e);
      return undefined;
    }
  }
}
