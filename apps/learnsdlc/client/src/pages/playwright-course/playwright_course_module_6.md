'''
# Module 6: Conquering the Multi-Application Beast: Strategies for Scale

## A Reader's Challenge: A Plethora of Applications

A reader writes:

> Dear Marilyn,
>
> The Page Object Model has brought a semblance of order to my code. For a single application, it is a thing of beauty. But I am not dealing with a single application. I am dealing with over 60 of them. Many share common elements—a header, a footer, a navigation menu—but each also has its own unique quirks and complexities. How can I apply the Page Object Model to such a sprawling and diverse landscape without creating a maintenance nightmare of a different sort?

An excellent and entirely logical question. You have scaled the first peak of abstraction, only to find a vast and imposing mountain range stretching before you. To conquer this range, we must not simply apply the same strategy with more force; we must adopt a more sophisticated, more hierarchical approach. We must think not only in terms of pages, but in terms of **inheritance** and **composition**.

### The Common Denominator: The Power of a Base Page

Your observation that many of your applications share common elements is the key. It is the thread that will lead us out of this labyrinth. We will begin by creating a `BasePage` class. This class will encapsulate the locators and actions for all the UI elements that are common across all (or most) of your applications.

```typescript
// In a new file, 'BasePage.ts'

import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.homeLink = page.getByRole('link', { name: 'Home' });
  }

  async navigateHome() {
    await this.homeLink.click();
  }
}
```

This `BasePage` now serves as a foundation, a common ancestor from which all your application-specific Page Objects will descend.

### The Logic of Specialization: Inheritance in Action

Now, for each of your 60 applications, you will create a specific Page Object that **extends** the `BasePage`. This new class will inherit all the properties and methods of the `BasePage`, and you can then add the locators and actions that are unique to that specific application.

Let us imagine we have an application called "PICASSO Application One."

```typescript
// In 'PicassoAppOnePage.ts'

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PicassoAppOnePage extends BasePage {
  readonly specialButton: Locator;
  readonly uniqueForm: Locator;

  constructor(page: Page) {
    // 'super' calls the constructor of the BasePage
    super(page);

    // Now we define the locators unique to this application
    this.specialButton = page.getByRole('button', { name: 'Do Something Special' });
    this.uniqueForm = page.locator('#unique-form-for-picasso-one');
  }

  async doSomethingSpecial() {
    await this.specialButton.click();
  }
}
```

Do you see the elegance of this approach? If the header changes, you update it in one place: `BasePage.ts`. The change is then automatically inherited by all 60 of your application-specific Page Objects. You have achieved both specialization and maintainability.

### Divide and Conquer: The Strategic Use of Projects

Playwright offers a powerful feature called **projects** that is perfectly suited for your multi-application environment. In your `playwright.config.ts` file, you can define a separate project for each of your applications or application groups. This allows you to:

*   Run tests for a specific application in isolation.
*   Set different configurations (e.g., base URLs, timeouts) for different applications.
*   Run tests for all applications in parallel, dramatically reducing your overall test execution time.

```typescript
// In playwright.config.ts

import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'PICASSO App One',
      testDir: './tests/picasso-app-one',
      use: { baseURL: 'https://picasso-app-one.example.com' },
    },
    {
      name: 'EDCS App Five',
      testDir: './tests/edcs-app-five',
      use: { baseURL: 'https://edcs-app-five.example.com' },
    },
    // ... and so on for all 60+ applications
  ],
});
```

### The Database as an Ally: A Source of Truth

Finally, let us not forget the role of the database. Your existing framework wisely uses SQL queries to fetch test data and verify application state. We will continue this practice. Create a dedicated `database.ts` helper file to manage your database connection and export functions for common queries. Your Page Object methods can then call these functions to retrieve data or assert that an action has had the desired effect on the database.

This combination of inheritance, projects, and database integration provides a robust and scalable architecture for conquering your multi-application beast. It is a testament to the power of logical thinking.

---

## Module 6 Quiz: A Test of Your Architectural Acumen

1.  What is the primary purpose of a `BasePage` class in a multi-application testing framework?
    a)  To contain all the tests for all applications.
    b)  To encapsulate the locators and actions for common UI elements shared across applications.
    c)  To configure the Playwright test runner.
    d)  To connect to the test database.

2.  How does the concept of inheritance apply to Page Object Models in this context?
    a)  Tests inherit from Page Objects.
    b)  Application-specific Page Objects inherit from a common `BasePage`.
    c)  Locators inherit from other locators.
    d)  The `playwright.config.ts` file inherits from the test files.

3.  What Playwright feature is recommended for managing tests for multiple, distinct applications?
    a)  Test hooks (`beforeEach`, `afterEach`).
    b)  Locators.
    c)  Projects.
    d)  Assertions.

4.  What is a key benefit of using Playwright projects for a multi-application setup?
    a)  It makes the tests easier to write.
    b)  It allows you to run tests for specific applications in isolation and in parallel.
    c)  It automatically generates Page Objects for you.
    d)  It eliminates the need for a `BasePage`.

5.  What is the recommended approach for integrating database operations into your Playwright tests?
    a)  Embed SQL queries directly into your test files.
    b)  Create a dedicated helper file (e.g., `database.ts`) to manage the connection and export query functions.
    c)  Avoid database interactions entirely and rely only on UI assertions.
    d)  Use the Playwright API to directly query the database.
'''
