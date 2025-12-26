// src/core/page-types/PageAction.ts
export interface PageAction {
  action: string; // e.g., 'click', 'fill', 'submit'
  target?: string; // field name / button text / product name
  value?: string; // value to fill
}
