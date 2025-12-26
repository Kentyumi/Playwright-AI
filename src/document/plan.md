Tech Lead Automation Plan for Playwright-AI Project

---

# 1️⃣ Input / Testcase Handling (TXT → JSON → AI)

**Goal:**

* All testcases in .txt or .json
* Stable parser converts to JSON schema
* Standardize Testcase / TestStep model

**Actions:**

* Add JSON schema validator (zod/yup)
* Separate parser layers: TXT → intermediate string → sanitized JSON
* Organize folders: `testcases/raw/`, `testcases/json/`

# 2️⃣ Page Abstraction (AI-ready POM)

**Goal:**

* Avoid manual POM creation for each page
* Each PageType has defined capabilities (fill, submit, open, etc.)
* AI locator heuristic + scoring

**Actions:**

* Refactor PageTypes to separate locator scoring logic
* Logging for action & locator
* DefaultPageTypeResolver maps action → PageType
* Throws clear error if no handler found

# 3️⃣ Executor / Runtime

**Goal:**

* JSON → execute actions → browser interaction
* No need to generate `.spec.ts` unless for audit
* Support batch running multiple testcases

**Actions:**

* TestExecutor: async handling, try/catch, fail context, screenshot
* Runner script for folder of JSON testcases
* Options: --headed / --headless / CI environment

# 4️⃣ Reporting & Analytics

**Goal:**

* Not just PASS/FAIL, but detailed step execution, locator chosen, screenshot

**Actions:**

* Build TestReporter: JSON report → HTML summary
* Embed screenshot, failure reason, locator used
* Customer sees AI-driven interaction end-to-end

# Sprint Plan

1. **Sprint 1:** Stabilize TXT → JSON parser; batch parse; TestExecutor runs JSON correctly
2. **Sprint 2:** Refine PageType heuristic + logging; add more PageType; confirm action-locator mapping
3. **Sprint 3:** Build TestReporter; batch run → HTML report + screenshots
4. **Sprint 4:** Optional `.spec.ts` generation for audit/review; prepare demo: run multiple testcase only using TXT

**Tech Lead Advice:**

* Focus on reusable components (Executor + PageType + Parser)
* Generating code / fancy report is nice-to-have, don’t block demo



