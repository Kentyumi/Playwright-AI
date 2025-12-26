// src/core/page-types/BasePageContract.ts
import { Page } from '@playwright/test';
import { PageAction } from './PageAction';

export interface BasePageContract {
  name: string;
  canHandle(action: PageAction): boolean;
  perform(page: Page, action: PageAction): Promise<void>;
}
