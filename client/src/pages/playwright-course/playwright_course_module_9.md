
# Module 9: The Final Exam: A Test of Your Mettle

## A Challenge from Marilyn

My dear student,

We have journeyed far. We have dismantled flawed logic and erected a new edifice of reason. We have translated the arcane language of spreadsheets into the elegant prose of Playwright. We have constructed an engine of automation, a testament to the power of a well-ordered mind.

But knowledge, without application, is mere trivia. The time has come to put your newfound intellect to the test. The time has come for your final exam.

### The Scenario: The "Phoenix" Application

Imagine a new application has been introduced into your ecosystem. It is called "Phoenix," and it has been developed by a team with a... *creative*... approach to software engineering. It shares some superficial similarities with your existing PICASSO and EDCS applications, but it is, in reality, a unique and challenging beast.

Your task is to build a complete, end-to-end test suite for the Phoenix application, using all of the principles and techniques we have covered in this course. You will be provided with a (simulated) Excel test file and a set of requirements. You must build a new GRACE-style framework for Phoenix that is both robust and resilient.

### The Requirements

1.  **The Excel Test File:** You will be given `Phoenix_Regression.xlsx`. It contains a series of test cases, actions, and objects, in the familiar format.

2.  **The Application:** The Phoenix application has the following features:
    *   A login page with a CAPTCHA (which, for the purposes of this exam, can be bypassed with a special URL parameter: `?bypass_captcha=true`).
    *   A main dashboard with a dynamically loading table of data.
    *   A form for creating a new "project," which involves text inputs, dropdowns, and a file upload.
    *   A search page with multiple filters.
    *   An API endpoint (`/api/projects`) that returns a list of projects in JSON format.

### The Tasks

You must create a new Playwright project that accomplishes the following:

1.  **The GRACE Engine:**
    *   Create a **Test Runner** that can parse the `Phoenix_Regression.xlsx` file.
    *   Create an **Action Dispatcher** that can execute the actions defined in the spreadsheet.
    *   Create a **Playwright Abstraction Layer (PAL)** with a **Locator Factory** that can handle the unique and often illogical locators used in the Phoenix application (a mix of `data-testid` attributes, `aria-label`s, and, regrettably, some very fragile, deeply-nested CSS selectors).
    *   Create a **Verification Library** to handle all `Verify...` actions.

2.  **Advanced Techniques:**
    *   Implement a **programmatic login** strategy. Your tests should not interact with the login UI. They should log in once, save the authentication state, and reuse it for all subsequent tests.
    *   Your tests must **run in parallel**.
    *   You must use **API testing** to verify that a project created through the UI also appears in the response from the `/api/projects` endpoint.
    *   Your tests must generate a **Trace Viewer** file on failure.

3.  **The Test Suite:**
    *   Your final test suite must execute all the test cases defined in `Phoenix_Regression.xlsx`.
    *   The tests must be **resilient**. They should not fail due to minor UI changes or network delays.
    *   The tests must be **maintainable**. The code should be clean, well-organized, and easy to understand.

### The Deliverables

You will submit a link to a Git repository containing your complete Playwright project. The repository should include:

*   Your `playwright.config.ts` file.
*   Your GRACE engine components (Test Runner, Action Dispatcher, PAL, etc.).
*   Your test files.
*   A `README.md` file that explains how to install and run your test suite.

### The Evaluation Criteria

You will be judged not merely on whether your tests pass, but on the intelligence and elegance of your solution. I will be looking for:

*   **Correctness:** Does your framework accurately execute the logic defined in the Excel file?
*   **Resilience:** How well do your tests handle dynamic content and delays?
*   **Maintainability:** Is your code clean, well-structured, and easy to modify?
*   **Efficiency:** Have you correctly implemented parallel execution and programmatic login?
*   **Completeness:** Have you implemented all the required features and techniques?

This is your opportunity to demonstrate that you have not just learned, but that you have understood. It is your chance to prove that you are not just a test automator, but a true engineer of quality.

I await your solution with great anticipation.

Yours in logic,

Marilyn
