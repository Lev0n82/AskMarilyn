# C# Coding Style Cheat Sheet

## File Organization

```
1. Using statements (System first, then alphabetical)
2. Namespace declaration
3. Class/Interface declaration
   ├── Constants
   ├── Static fields
   ├── Instance fields
   ├── Constructors
   ├── Properties
   ├── Public methods
   ├── Private methods
   └── Nested types
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `CustomerOrder` |
| Interfaces | IPascalCase | `IRepository` |
| Methods | PascalCase | `CalculateTotal()` |
| Properties | PascalCase | `FirstName` |
| Local variables | camelCase | `orderCount` |
| Parameters | camelCase | `customerId` |
| Private fields | _camelCase | `_connectionString` |
| Constants | UPPER_CASE | `MAX_RETRY_COUNT` |
| Enums | PascalCase | `OrderStatus.Pending` |

## Indentation Rules

- **Use spaces, not tabs** (4 spaces per level)
- **Braces on new lines** (Allman style)
- **One statement per line**
- **Blank line between logical sections**

```csharp
// ✓ Correct
public void ProcessOrder(Order order)
{
    if (order == null)
    {
        throw new ArgumentNullException(nameof(order));
    }

    ValidateOrder(order);
    SaveOrder(order);
}

// ✗ Wrong
public void ProcessOrder(Order order) {
    if (order == null) { throw new ArgumentNullException(nameof(order)); }
    ValidateOrder(order); SaveOrder(order);
}
```

## Statement Guidelines

### If Statements
```csharp
// Always use braces, even for single lines
if (condition)
{
    DoSomething();
}

// Avoid nested ternary
// ✗ Bad: result = a ? b ? c : d : e;
// ✓ Good: Use if-else for complex logic
```

### Switch Statements
```csharp
switch (status)
{
    case Status.Active:
        ProcessActive();
        break;
    case Status.Pending:
        ProcessPending();
        break;
    default:
        throw new InvalidOperationException();
}
```

### LINQ
```csharp
// Multi-line for readability
var results = customers
    .Where(c => c.IsActive)
    .OrderBy(c => c.Name)
    .Select(c => new { c.Id, c.Name })
    .ToList();
```

## White Space Rules

| Context | Rule |
|---------|------|
| After keywords | `if (`, `for (`, `while (` |
| Around operators | `x = y + z` |
| After commas | `Method(a, b, c)` |
| No space before `(` in methods | `DoSomething()` |
| Blank line between methods | Always |
| No trailing whitespace | Never |

## Quick Checks Before Commit

- [ ] File organization follows standard order
- [ ] All names follow conventions
- [ ] Consistent indentation (4 spaces)
- [ ] Braces on new lines
- [ ] No trailing whitespace
- [ ] Blank lines between logical sections
- [ ] No commented-out code
- [ ] No magic numbers (use constants)

## The Golden Rule

> "Code is read 10x more than it's written. Write for the reader."

---
*Generated from Ask Marilyn About Software Testing - C# Coding Style Guide Course*
