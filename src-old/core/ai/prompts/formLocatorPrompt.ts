export function formLocatorPrompt(
  html: string,
  target: string,
  error: string
): string {
  return `
You are an expert test automation AI.

Given this HTML:
${html}

The test failed when trying to find a form field for target: "${target}"
Error: ${error}

Return ONLY a JSON object:
{
  "selector": "best css selector",
  "confidence": 0.0-1.0,
  "reason": "short explanation"
}
`;
}
