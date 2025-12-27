import { Page } from '@playwright/test';
import { PageAction } from './PageAction';

export interface PageTypeResolver {
  resolve(page: Page, action: PageAction): Promise<void>;
}
