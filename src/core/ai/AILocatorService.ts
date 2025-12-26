import { OllamaClient } from './OllamaClient';
import { AISuggestion } from './AISuggestion';
import { formLocatorPrompt } from './prompts/formLocatorPrompt';

export class AILocatorService {
  static suggest(html: string, target: string, error: string): AISuggestion {
    const prompt = formLocatorPrompt(html, target, error);
    const raw = OllamaClient.ask(prompt);

    return JSON.parse(raw);
  }
}
