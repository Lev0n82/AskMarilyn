'''
# Module 2: Enter Playwright: The Thinking Person's Automation Tool

## A Reader Inquires About the Proper Tools

A reader writes:

> Dear Marilyn,
>
> I am convinced of the logic of Action-Based Testing. It is, as you say, a more rational approach. But what of the tools? My team is currently using Selenium, and while it is a capable tool, it often feels like we are fighting against it, rather than with it. Is there a tool that is more aligned with the principles of ABT?

An astute question, my dear reader. A flawed tool can undermine even the most sound of methodologies. It is like trying to solve a complex equation with a broken calculator. The logic may be impeccable, but the result will be erroneous.

### The Right Tool for the Job: A Matter of Intelligence

Selenium, while a venerable tool, is a product of a bygone era. It was designed for a simpler web, a web that is rapidly fading into memory. The modern web is a dynamic, complex, and often chaotic place. To navigate it effectively, we require a tool that is not only powerful, but intelligent.

That tool, my friends, is **Playwright**.

Playwright is a modern, open-source automation library developed by Microsoft. It is designed from the ground up to handle the complexities of the modern web. It is fast, reliable, and, most importantly, it is intelligent. Playwright understands the web in a way that older tools simply do not.

### First Principles: Laying the Foundation

Before we can wield this powerful tool, we must first bring it into our workshop. The installation of Playwright is a straightforward affair, a testament to its modern design. A single command is all that is required to install Playwright and its browser dependencies:

```bash
npm init playwright@latest
```

This command will not only install Playwright, but it will also create a `playwright.config.ts` file, a central hub for configuring your testing environment. It will also provide you with an example test, a simple "hello world" to verify that all is in order.

### The Building Blocks of Automation: A Glimpse into the API

The Playwright API is a model of clarity and conciseness. It is designed to be intuitive, to be expressive, and to be powerful. Let us examine a few of the key concepts:

*   **`browser`**: Represents a browser instance (Chromium, Firefox, or WebKit).
*   **`context`**: An isolated browser session, with its own cookies, local storage, and cache.
*   **`page`**: A single tab within a browser context.
*   **`locator`**: A reference to an element on the page. This is the heart of Playwright's intelligence, and we will explore it in great detail in the next module.

### A Simple Proof: Your First Foray into a More Logical World

Let us now write our first Playwright test. It will be a simple test, but it will serve to illustrate the elegance and power of the Playwright API.

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const title = page.locator('.navbar__inner .navbar__title');
  await expect(title).toHaveText('Playwright');
});
```

In this simple example, we:

1.  Navigate to the Playwright website.
2.  Create a `locator` for the title element.
3.  Use the `expect` function to assert that the title has the text "Playwright".

Notice the `await` keyword. Playwright is an asynchronous library, and every interaction with the browser returns a `Promise`. The `await` keyword allows us to write our tests in a clean, linear fashion, without getting bogged down in the complexities of asynchronous programming.

In the next module, we will delve deeper into the art of the locator, and you will begin to truly appreciate the intelligence of this remarkable tool.

---

## Module 2 Quiz: A Test of Your Acumen

1.  Why is Playwright considered a more "intelligent" tool than Selenium?
    a)  It is faster.
    b)  It is developed by Microsoft.
    c)  It is designed to handle the complexities of the modern web.
    d)  It is easier to install.

2.  What is the purpose of the `playwright.config.ts` file?
    a)  To store your test cases.
    b)  To configure your testing environment.
    c)  To define your Action Catalog.
    d)  To generate test reports.

3.  What is a Playwright `locator`?
    a)  A way to find an element on the page.
    b)  A way to store test data.
    c)  A way to configure the browser.
    d)  A way to write assertions.

4.  Why is the `await` keyword so important when writing Playwright tests?
    a)  It makes the tests run faster.
    b)  It allows you to write asynchronous code in a synchronous style.
    c)  It is required by the TypeScript compiler.
    d)  It is a Playwright-specific keyword.

5.  What are the three browser engines that Playwright supports?
    a)  Chrome, Firefox, and Safari.
    b)  Chromium, Firefox, and WebKit.
    c)  Chrome, Edge, and Safari.
    d)  Chromium, Edge, and WebKit.
'''
