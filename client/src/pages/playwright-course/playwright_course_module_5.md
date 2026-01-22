'''
# Module 5: The Page Object Model: Bringing Order to Chaos

## A Reader Confronts a Labyrinth of Complexity

A reader writes:

> Dear Marilyn,
>
> My application is not a simple, single-page affair. It is a labyrinth, a sprawling collection of interconnected pages, forms, and workflows. As I translate my Excel-based tests into Playwright actions, I find my code becoming a tangled mess. My action functions are growing in number and complexity, and I fear I am merely trading one form of chaos for another. How can I impose order on this burgeoning complexity, especially when dealing with over 60 distinct applications?

Your concern is not only valid, it is a sign of a burgeoning intellect. You have recognized that a simple list of actions, while a significant improvement over brittle scripts, is insufficient for managing the complexity of a large-scale, multi-application environment. You are standing at the precipice of a new level of understanding, ready to embrace a more sophisticated, more organized approach.

### The Problem of Complexity: The Hydra of Modern Applications

As your test suite grows, you will inevitably encounter what I call the "Hydra of Complexity." For every action you define, two more seem to spring up. Your `actions.ts` file, once a model of clarity, becomes a monolithic beast, difficult to navigate and impossible to maintain. When a UI element changes, you find yourself hunting through hundreds of lines of code to update every instance of its locator.

This is not a sustainable path. It is a path that leads back to the very fragility we sought to escape. We need a way to group related actions and locators, to create logical boundaries within our code that mirror the logical boundaries of our application.

### A Logical Abstraction: The Page Object Model (POM)

The solution to this problem is a design pattern known as the **Page Object Model (POM)**. The name, I concede, is a slight misnomer. A "Page Object" does not necessarily represent an entire page. Rather, it represents a logical component of your user interface. This could be a login form, a navigation menu, a search results page, or, in your case, an entire application within your EDCS or PICASSO framework.

The principle is simple: for each logical component of your application, you create a class. This class will contain all the locators for the elements within that component, and all the methods (our "actions") that can be performed on that component.

### The Blueprint for Sanity: Crafting Reusable Page Objects

Let us construct a simple Page Object for a hypothetical login page. This will serve as our blueprint.

```typescript
// In a new file, perhaps 'LoginPage.ts'

import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  // It is good practice to make the page and locators readonly.
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username or email address');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  // This is our "Login" action, now encapsulated within the LoginPage class.
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async goto() {
    await this.page.goto('/login');
  }
}
```

Now, in our test, we can use this `LoginPage` object to interact with the login page in a clean, readable, and maintainable way.

```typescript
// In our test file

import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

test('Successful Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'a_very_secure_password');

  // Assertion remains in the test, where it belongs.
  await expect(page.getByText('Welcome, testuser')).toBeVisible();
});
```

The beauty of this approach is that if the login form ever changes, we only need to update the `LoginPage.ts` file. Our tests, which now speak the high-level language of our application ("loginPage.login(...)"), remain untouched.

### A Case Study: Your Turn to Impose Order

Now, apply this logic to your own world. Choose one of the 60 applications in your collection. Create a Page Object class for it. Start by identifying the key locators and actions associated with that application. Encapsulate them within the class. You will find that this simple act of organization brings a newfound clarity to your code, transforming a tangled web of functions into a well-ordered library of reusable components.

This is the path to sanity, my dear reader. This is the logic of flawless web automation.

---

## Module 5 Quiz: A Test of Your Organizational Skills

1.  What is the primary problem that the Page Object Model (POM) is designed to solve?
    a)  Slow test execution.
    b)  The complexity and maintenance of a large test suite.
    c)  The difficulty of writing assertions.
    d)  The limitations of the Playwright API.

2.  In the context of POM, what does a "Page Object" represent?
    a)  An entire web page.
    b)  A single HTML element.
    c)  A logical component of the user interface.
    d)  A test case.

3.  What are the two main components of a Page Object class?
    a)  Test data and test results.
    b)  Locators and action methods.
    c)  Configuration settings and browser instances.
    d)  Assertions and test hooks.

4.  How does POM improve the maintainability of a test suite?
    a)  By making tests run faster.
    b)  By centralizing the definition of locators and actions for a given component.
    c)  By automatically generating test reports.
    d)  By eliminating the need for assertions.

5.  Where should assertions (`expect` calls) typically be placed when using the Page Object Model?
    a)  Inside the Page Object methods.
    b)  In a separate `assertions.ts` file.
    c)  Directly within the test files that use the Page Objects.
    d)  Assertions are not necessary when using POM.
'''
