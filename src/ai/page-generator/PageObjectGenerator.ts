import fs from 'fs';
import path from 'path';
import { Testcase, TestStep } from '../models/TestcaseModel';

export class PageObjectGenerator {

    static generatePageObjects(testcase: Testcase) {
        const pagesMap: Record<string, TestStep[]> = {};

        // Group steps by page (simplified heuristic: action type)
        testcase.steps.forEach(step => {
            const pageName = this.guessPageName(step);
            if (!pagesMap[pageName]) pagesMap[pageName] = [];
            pagesMap[pageName].push(step);
        });

        // Generate one class per page
        Object.entries(pagesMap).forEach(([pageName, steps]) => {
            const content = this.buildClass(pageName, steps);
            const outputPath = path.resolve(`src/pages/${pageName}.ts`);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, content, 'utf-8');
            console.log(`✅ Generated PageObject: ${outputPath}`);
        });
    }

    private static guessPageName(step: TestStep) {
        // heuristic mapping: action → page
        switch (step.action) {
            case 'login': return 'LoginPage';
            case 'add_to_cart': return 'InventoryPage';
            case 'checkout': return 'CheckoutPage';
            default: return 'DefaultPage';
        }
    }

    private static buildClass(pageName: string, steps: TestStep[]) {
        const methods = steps.map(step => this.buildMethod(step)).join('\n\n');
        return `
import { Page } from '@playwright/test';

export class ${pageName} {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

${methods}
}
`;
    }

    private static buildMethod(step: TestStep) {
        const methodName = this.normalizeAction(step.action);

        return `
  async ${methodName}(stepData?: any) {
    await LocatorEngine.performAction(this.page, stepData || ${JSON.stringify(step)});
  }`;
    }

    private static normalizeAction(action: string) {
        return action.replace(/[^a-zA-Z0-9]/g, '_');
    }
}
