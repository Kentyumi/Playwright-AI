export interface TestStep {
  action: string;
  [key: string]: any;
}

export interface Testcase {
  testName: string;
  steps: TestStep[];
}
