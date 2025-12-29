import { TestStep } from '../models/TestcaseModel';

export function normalizeSteps(rawText: string): TestStep[] {
  /**
   * TẠM THỜI: rule-based
   * Sau này mới gắn AI
   */
  const steps: TestStep[] = [];

  if (rawText.includes('Login')) {
    steps.push({ action: 'login' });
  }

  if (rawText.includes('Click')) {
    steps.push({ action: 'click' });
  }

  return steps;
}
