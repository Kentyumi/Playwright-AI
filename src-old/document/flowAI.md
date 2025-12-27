TXT testcase
   ↓
TestcaseParser → structured JSON
   ↓
AI Page Generator → auto generate PageObject classes + methods
   ↓
TestGenerator → generate Playwright test (calls PageObject methods)
   ↓
TestExecutor → run test, handle failures
   ↓
TestReporter → HTML + screenshots + locator log