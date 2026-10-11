# README Standards

Structure and style for every `packages/*/README.md`. Copy [`README-TEMPLATE.md`](./README-TEMPLATE.md) for the exact markdown of each section. Summary rules: [`packages/AGENTS.md`](../packages/AGENTS.md).

`pnpm validate:docs` enforces the section list. Missing **License** is an error; other missing sections are warnings.

## Section order

Fixed order; do not reorder.

| #   | Section            | Heading                             | Required                   |
| --- | ------------------ | ----------------------------------- | -------------------------- |
| 1   | Title and badges   | `# @jmlweb/name`                    | yes                        |
| 2   | Description        | `> one line`                        | yes                        |
| 3   | Features           | `## ✨ Features`                    | yes                        |
| 4   | Installation       | `## 📦 Installation`                | yes                        |
| 5   | Quick Start        | `## 🚀 Quick Start`                 | yes                        |
| 6   | Examples           | `## 💡 Examples`                    | yes                        |
| 7   | Configuration      | `## 📋 Configuration Details`       | yes                        |
| 8   | When to Use        | `## 🎯 When to Use`                 | yes                        |
| 9   | Extending          | `## 🔧 Extending the Configuration` | yes                        |
| 10  | Usage with Scripts | `## 📝 Usage with Scripts`          | yes                        |
| 11  | Requirements       | `## 📋 Requirements`                | yes                        |
| 12  | Peer Dependencies  | `## 📦 Peer Dependencies`           | yes                        |
| 13  | Related Packages   | `## 🔗 Related Packages`            | yes                        |
| 14  | Migration Guide    | `## 🔄 Migration Guide`             | only with breaking changes |
| 15  | License            | `## 📄 License`                     | yes, last                  |

## Per-section rules

### 1. Title and badges

- npm version badge, MIT license badge, Node.js badge with the package's minimum `engines.node`
- Extra badges for major dependencies (ESLint, TypeScript, React, …) when relevant

### 2. Description

- One line, blockquote, primary use case
- Say so if the package extends another

### 3. Features

- 3-6 bullets, emoji prefix, bold name, one sentence each
- Benefits over technical detail

### 4. Installation

- `npm install --save-dev`, including every peer dependency explicitly (no `...` or `etc.`)
- `npm` is the reference manager; users adapt to pnpm or yarn

### 5. Quick Start

- Most common setup first, then optional advanced setup
- Complete, working snippets with the right language tag

### 6. Examples

- 2-4 practical examples, basic to advanced, descriptive titles
- Before/after when showing transformations

### 7. Configuration details

- Tables for options (option, value, description); list defaults
- Subsections for complex configs (e.g. TypeScript files, key rules, what's included)

### 8. When to Use

- 3-6 ✅ use cases
- Say when not to use it and link the alternative package

### 9. Extending

- How to extend or override; simple and advanced patterns

### 10. Usage with Scripts

- `package.json` scripts snippet plus the run command; most useful first

### 11. Requirements

- Bold name, `>=` minimums, always include Node.js; major dependencies only

### 12. Peer dependencies

- Every peer dependency with a caret range
- Explain non-obvious peers

### 13. Related packages

- Relative links (`../name`) with a short description
- Packages used together, extended by, or extending this one

### 14. Migration guide

- Only for breaking changes: what changed, numbered steps, before/after code, changelog link

### 15. License

- `MIT`, last section

## Special sections

Allowed between the standard ones when a package needs them:

- `## 🔄 Import Sorting`: ESLint packages, with before/after
- Subsections under Configuration Details for complex packages

## Formatting

| Topic       | Rule                                                                           |
| ----------- | ------------------------------------------------------------------------------ |
| Emojis      | Fixed per section (table above); do not invent new ones                        |
| Code blocks | Always a language tag (`javascript`, `json`, `typescript`, `bash`, `markdown`) |
| Examples    | Complete and runnable; comment only non-obvious parts                          |
| Links       | Relative for monorepo packages, absolute for external; descriptive text        |
| Tables      | For options; clear headers; code formatting for names and values               |

## Workflows

Create:

1. Copy [`README-TEMPLATE.md`](./README-TEMPLATE.md)
2. Fill every required section
3. Compare with a similar README
4. Run every code example
5. Check links
6. `pnpm validate:docs`

Update:

1. Keep structure and order
2. Match existing style
3. Update every affected section
4. Add a migration guide for breaking changes
5. Keep examples in sync with the API

Reference READMEs: `prettier-config-base` (simple), `eslint-config-base` (complex), `tsconfig-base` (TypeScript), `vitest-config` (testing).

## Checklist

- [ ] All required sections present and ordered
- [ ] Emojis consistent
- [ ] Examples complete and runnable
- [ ] Monorepo links relative
- [ ] Versions match `package.json`
- [ ] Peer dependencies match `package.json`
- [ ] Requirements match real dependencies
- [ ] Related packages linked
- [ ] Formatting matches other READMEs
