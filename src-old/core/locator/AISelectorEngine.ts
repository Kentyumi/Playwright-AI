// src/core/locator/AISelectorEngine.ts
import { execSync } from 'child_process';

export class AISelectorEngine {
  // Hiện tại dùng MCP / stub tạm thời, sau này có thể swap sang Ollama/Qwen2.5
  static async getSelector(dom: string, target: string): Promise<string> {
    try {
      // 1️⃣ Ví dụ gọi MCP CLI
      const cmd = `mcp find-selector --dom '${dom}' --target "${target}"`;
      const output = execSync(cmd, { encoding: 'utf-8' }).trim();
      if (output) return output;

      // 2️⃣ Nếu MCP không có kết quả, trả về selector mặc định (body) tạm
      return 'body';
    } catch (err) {
      console.warn('⚠️ MCP AI fallback failed, returning body:', err);
      return 'body';
    }
  }
}
