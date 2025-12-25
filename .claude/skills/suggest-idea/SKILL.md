---
name: suggest-idea
description: Proactively analyze the project and suggest improvement ideas. Use when you want Claude to identify opportunities, gaps, or enhancements based on codebase analysis.
---

# Suggest Idea

Analyze the project and proactively suggest improvement ideas.

## Instructions

When the user runs `/suggest-idea`:

### Step 1 - Analyze Project State

Examine multiple sources:

1. **Project documentation:**
   - `README.md` - Project purpose and features
   - `AGENTS.md` - Goals and conventions
   - `docs/` folder if exists

2. **Current packages:**
   - `packages/*/package.json` - What exists
   - `packages/*/src/` - Implementation patterns

3. **Existing ideas and tasks:**

   ```bash
   # Check existing ideas to avoid duplicates
   gh issue list --repo jmlweb/tooling --label "idea" --state all --json title,state,labels --limit 100

   # Check existing tasks
   gh issue list --repo jmlweb/tooling --state open --json title,labels --limit 50
   ```

4. **Code patterns:**
   - Common patterns that could be abstracted
   - Missing utilities or helpers
   - Inconsistencies that could be unified

### Step 2 - Identify Opportunities

Look for:

- **Missing features:** Gaps in functionality
- **Improvements:** Ways to enhance existing features
- **Refactoring:** Code that could be cleaner
- **Documentation:** Missing or outdated docs
- **DX improvements:** Developer experience enhancements
- **Performance:** Optimization opportunities

### Step 3 - Validate Uniqueness

Before suggesting, verify:

- Not already an open idea
- Not already a rejected idea (unless context changed)
- Not already implemented
- Not already a pending task

### Step 4 - Generate Suggestion

Create a well-formed idea description:

```text
I've identified an improvement opportunity:

## Suggested Idea: [Title]

**Category:** feature/improvement/refactor/fix/documentation

**Description:**
[What the idea is about]

**Motivation:**
[Why this would be valuable]

**Proposed Approach:**
[High-level implementation suggestion]

**Estimated Effort:** Low/Medium/High
**Estimated Impact:** Low/Medium/High

Would you like me to create this as an idea with /new-idea?
```

### Step 5 - Create If Approved

If user approves, invoke `/new-idea` with the generated description.

## Analysis Focus Areas

**For a tooling/config monorepo like this:**

- New shared configurations (Vitest, Playwright, etc.)
- Cross-package utilities
- CLI improvements
- Build/publish workflow enhancements
- Documentation generators
- Testing utilities
- Linting rule additions

## Example

```text
/suggest-idea

Analyzing jmlweb-tooling project...

Checked:
- 5 existing packages (prettier, eslint, tsconfig configs)
- 3 pending ideas
- 8 open tasks
- Codebase patterns

## Suggested Idea: Add shared Vitest configuration package

**Category:** feature

**Description:**
Create a new package `@jmlweb/vitest-config` that provides
base Vitest configurations for projects in the ecosystem.

**Motivation:**
- Vitest is becoming the standard for testing in Vite projects
- Having a shared config ensures consistent testing setup
- Follows the same pattern as existing eslint and prettier configs

**Proposed Approach:**
1. Create new package under packages/vitest-config
2. Include base config with sensible defaults
3. Add TypeScript support and coverage settings
4. Document usage in README

**Estimated Effort:** Low (2-3 hours)
**Estimated Impact:** Medium (useful for all projects using Vitest)

Create this idea? [Yes/No]
```
