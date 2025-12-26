import fs from 'fs';
import path from 'path';
import { Testcase, TestStep } from '../models/TestcaseModel';

interface PageMethod {
    name: string;
    steps: TestStep[];
}

interface PageFile {
    name: string;
    methods: PageMethod[];
}

export class PageObjectGenerator {
    static generate(testcase: Testcase) {
        const pages: Record<string, PageFile> = {};

        // organize steps into pages and methods
        for (const step of testcase.steps) {
            const pageName = this.resolvePage(step); // Ai/Rule decide page
            if (!pages[pageName]) pages[pageName] = { name: pageName, methods: [] };

            const methodName = this.methodName(step);
            let method = pages[pageName].methods.find(m => m.name === methodName);
            if (!method) {
                method = { name: methodName, steps: [] };
                pages[pageName].methods.push(method);
            }
            method.steps.push(step);
        }

        // generate page files
        const generatedFiles: string[] = [];
        for (const pageName in pages) {
            const page = pages[pageName];
            const content = this.buildPageContent(page);
            const filePath = path.resolve(`src/pages/${pageName.toLowerCase()}.page.ts`);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ Generated PageObject: ${filePath}`);
            generatedFiles.push(filePath);
        }

        // generate test file
        const testFilePath = path.resolve(`src/tests/generated/${this.normalize(testcase.testName)}.spec.ts`);
        const testContent = this.buildTestContent(testcase, pages);
        fs.writeFileSync(testFilePath, testContent, 'utf-8');
        console.log(`✅ Generated test: ${testFilePath}`);

        return testFilePath;
    }

    private static resolvePage(step: TestStep): string {
        // Rule simple: open/login → LoginPage, add_to_cart → InventoryPage, checkout/finish → CheckoutPage
        if (['open', 'login'].includes(step.action)) return 'LoginPage';
        if (['addToCart'].includes(step.action)) return 'InventoryPage';
        if (['checkout', 'fillCheckout', 'continue', 'finish'].includes(step.action)) return 'CheckoutPage';
        return 'GenericPage';
    }

    private static methodName(step: TestStep): string {
        // Simple method name based on action
        return step.action.replace(/[^a-zA-Z0-9]/g, '');
    }

    private static buildPageContent(page: PageFile): string {
        const methods = page.methods.map(m => {
            const stepsStr = m.steps
                .map(step => {
                    // Placeholder for step implementation
                    return `    // TODO: implement ${step.action} step`;
                })
                .join('\n');
            return `  async ${m.name}() {\n${stepsStr}\n  }`;
        }).join('\n\n');

        return `
import { Page } from '@playwright/test';

export class ${page.name} {
  constructor(private page: Page) {}

${methods}
}
`;
    }

    private static buildTestContent(testcase: Testcase, pages: Record<string, PageFile>): string {
        const imports = Object.keys(pages)
            .map(p => `import { ${p} } from '../../pages/${p.toLowerCase()}.page';`)
            .join('\n');

        const pageInstances = Object.keys(pages)
            .map(p => `  const ${p[0].toLowerCase() + p.slice(1)} = new ${p}(page);`)
            .join('\n');

        const stepCalls = testcase.steps
            .map(step => {
                const pageName = this.resolvePage(step);
                const instanceName = pageName[0].toLowerCase() + pageName.slice(1);
                const methodName = this.methodName(step);
                return `  await ${instanceName}.${methodName}();`;
            })
            .join('\n');

        return `
import { test } from '@playwright/test';
${imports}

test('${testcase.testName}', async ({ page }) => {
${pageInstances}

${stepCalls}
});
`;
    }

    private static normalize(name: string): string {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
}
