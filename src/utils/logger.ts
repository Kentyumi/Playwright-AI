export function logStep(stepIndex: number, action: string, message: string) {
  console.log(`🧩 [STEP ${stepIndex}] [${action.toUpperCase()}] ${message}`);
}

export function logLocator(name: string, selector: string, confidence?: number) {
  console.log(
    `🎯 [LOCATOR] "${name}" → ${selector} (confidence: ${confidence ?? 'N/A'})`
  );
}

export function logWarn(message: string) {
  console.warn(`⚠️  ${message}`);
}

export function logError(message: string) {
  console.error(`❌ ${message}`);
}
