# Technical Writing Cheat Sheet

## The Three Pillars

| Pillar | Definition | Goal |
|--------|------------|------|
| **Legibility** | Can the text be physically read? | Clear fonts, good contrast, proper formatting |
| **Readability** | Can sentences be easily parsed? | Short sentences, simple structure |
| **Comprehensibility** | Can the meaning be understood? | Clear explanations, logical flow |

## Sentence Guidelines

### Length Rules
- **Target**: 10-15 words per sentence
- **Maximum**: 20 words
- **Vary rhythm**: Mix short and medium sentences

### Structure
```
✓ Subject → Verb → Object (active voice)
✗ Object → was Verb-ed → by Subject (passive voice)

✓ "The system validates the input."
✗ "The input is validated by the system."
```

### Avoid Recursion
```
✗ Bad: "The module that processes the data that comes from 
        the API that connects to the server..."

✓ Good: "The module processes API data. The API connects 
         to the server."
```

## Word Choice

| Instead of | Use |
|------------|-----|
| utilize | use |
| implement | do, make |
| leverage | use |
| facilitate | help, enable |
| subsequently | then |
| prior to | before |
| in order to | to |
| at this point in time | now |
| in the event that | if |

## The Four-Step Explanation

1. **Definition**: What is it?
2. **Theorem**: What does it do?
3. **Proof**: How does it work?
4. **Conclusion**: Why does it matter?

```
DEFINITION: A cache stores frequently accessed data.
THEOREM: Caching reduces database load.
PROOF: Instead of querying the database each time, 
       the system checks the cache first.
CONCLUSION: This improves response time by 10x.
```

## Style Rules

### Contractions
- **Formal writing**: Don't use don't
- **Informal/tutorials**: Contractions are fine

### Articles (a/an)
- Use **"a"** before consonant sounds: a user, a URL
- Use **"an"** before vowel sounds: an API, an hour

### Tense Consistency
```
✗ "The function calculates the value and returned the result."
✓ "The function calculates the value and returns the result."
```

### Avoid Ego
```
✗ "I developed this feature..."
✗ "We implemented..."
✓ "This feature provides..."
✓ "The system implements..."
```

## Document Structure

```
1. Title (clear, specific)
2. Table of Contents (for 3+ pages)
3. Introduction (what & why)
4. Prerequisites (what readers need)
5. Main Content (the how)
6. Examples (working code)
7. Troubleshooting/FAQ
8. References/Further Reading
```

## Editor's Pet Peeves

### Grammar
| Wrong | Right |
|-------|-------|
| less items | fewer items |
| amount of users | number of users |
| data is | data are |
| criteria is | criterion is / criteria are |

### Spelling
| Wrong | Right |
|-------|-------|
| occured | occurred |
| seperate | separate |
| definately | definitely |
| accomodate | accommodate |

### Technical Terms
| Wrong | Right |
|-------|-------|
| indexes (DB) | indices |
| vertexes | vertices |
| matrixes | matrices |

## Quick Checklist

Before publishing:

- [ ] Average sentence length < 20 words?
- [ ] Active voice used?
- [ ] Simple words preferred?
- [ ] Consistent tense throughout?
- [ ] No "I/we" in formal docs?
- [ ] Spell check run?
- [ ] Technical terms correct?
- [ ] Examples tested and working?

## The Golden Rule

> "If you can't explain it simply, you don't understand it well enough."
> — Often attributed to Einstein

---
*Generated from Ask Marilyn About Software Testing - Technical Writing Made Easier Course*
