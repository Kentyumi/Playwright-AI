import { Page } from '@playwright/test';
import { PageAction } from '../contracts/PageAction';
import { DefaultPageTypeResolver } from '../page-types/DefaultPageTypeResolver';
import { FailureContext } from '../ai/FailureContext';

export class TestExecutor {
    private resolver = new DefaultPageTypeResolver();

    async execute(page: Page, actions: PageAction[]) {
        for (const action of actions) {
            try {
                await this.resolver.resolve(page, action);
            } catch (error: any) {
                const context: FailureContext = {
                    action,
                    url: page.url(),
                    htmlSnapshot: await page.content(),
                    errorMessage: error.message,
                };

                console.error('❌ Action failed:', context);
                throw error;
            }
        }
    }
