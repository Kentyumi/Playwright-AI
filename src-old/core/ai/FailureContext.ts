import { PageAction } from '../contracts/PageAction';

export interface FailureContext {
  action: PageAction;
  url: string;
  htmlSnapshot: string;
  errorMessage: string;
}
