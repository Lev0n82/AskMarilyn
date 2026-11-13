# Action Based Testing (ABT) Cheat Sheet

## The Three-Layer Architecture

| Layer | Purpose | Changes When |
|-------|---------|--------------|
| **Business Layer** | WHAT to test (user goals) | Business requirements change |
| **Interaction Layer** | HOW to interact (reusable actions) | Workflow changes |
| **Interface Layer** | WHERE to click (UI specifics) | UI changes |

## Key Principles

### 1. Separation of Concerns
- Business logic stays in business layer
- UI details isolated in interface layer
- One change = one place to update

### 2. Test Module Structure
```
TEST MODULE: Login Validation
├── OBJECTIVE: Verify user authentication
├── PRECONDITIONS: User exists in system
├── TEST CASES:
│   ├── TC1: Valid credentials → Success
│   ├── TC2: Invalid password → Error message
│   └── TC3: Empty fields → Validation error
└── CLEANUP: Logout user
```

### 3. Naming Conventions
- **Actions**: verb + noun (e.g., `click button`, `enter text`)
- **Test Modules**: descriptive purpose (e.g., `validate login`)
- **Arguments**: clear, typed (e.g., `username: string`)

## The 13 Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Hardcoded Values | Brittle tests | Use variables/data files |
| Copy-Paste Tests | Maintenance nightmare | Create reusable modules |
| UI-Dependent Logic | Breaks on UI changes | Use three-layer separation |
| Missing Cleanup | Test pollution | Always include cleanup steps |
| Implicit Waits | Flaky tests | Use explicit conditions |
| Over-Assertion | Hard to debug | One concept per assertion |
| Test Interdependence | Cascade failures | Independent test modules |
| Magic Numbers | Unclear intent | Named constants |
| Commented Code | Confusion | Delete or document |
| Giant Test Cases | Unmaintainable | Break into modules |
| No Error Handling | Silent failures | Explicit error checks |
| Environment Coupling | Can't run anywhere | Parameterize environment |
| Missing Documentation | Knowledge silos | Document purpose & usage |

## Quick Reference: Test Life-Cycle

```
1. SETUP → Prepare test environment
2. EXECUTE → Run test actions
3. VERIFY → Check expected results
4. CLEANUP → Restore initial state
5. REPORT → Log results
```

## Agile Integration

- **Sprint Planning**: Identify testable user stories
- **During Sprint**: Build test modules alongside features
- **Sprint Review**: Demo automated tests
- **Cross-over Testing**: Test interactions between sprint items and existing features

## Decision Table Template

| Condition 1 | Condition 2 | Condition 3 | Expected Result |
|-------------|-------------|-------------|-----------------|
| True | True | True | Action A |
| True | True | False | Action B |
| True | False | * | Action C |
| False | * | * | Action D |

## Remember

> "The best test is one that finds bugs, survives changes, and explains itself."

---
*Generated from Ask Marilyn About Software Testing - ABT Fundamentals Course*
