# @jmlweb/commitlint-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/commitlint-config)](https://www.npmjs.com/package/@jmlweb/commitlint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Shared commitlint configuration for enforcing Conventional Commits across projects. Flexible design works out-of-the-box for any project, with optional scope restrictions.

## Features

- Enforces [Conventional Commits](https://conventionalcommits.org) specification
- **No scope restrictions by default** - works with any project structure
- Configurable scopes when you need them
- Custom ignore functions for merge commits, dependabot, etc.
- TypeScript support with full type definitions

## Installation

```bash
npm install --save-dev @jmlweb/commitlint-config @commitlint/cli @commitlint/config-conventional
```

Or with pnpm:

```bash
pnpm add -D @jmlweb/commitlint-config @commitlint/cli @commitlint/config-conventional
```

## Quick Start

Create a `commitlint.config.js` file in your project root:

```javascript
import commitlintConfig from '@jmlweb/commitlint-config';

export default commitlintConfig;
```

That's it! Any commit type/scope following Conventional Commits is allowed.

## Usage Examples

### No Scope Restrictions (Default)

```javascript
// commitlint.config.js
import commitlintConfig from '@jmlweb/commitlint-config';

export default commitlintConfig;
```

Valid commits:

```text
feat: add new feature
fix(auth): resolve login issue
chore(whatever-you-want): update deps
```

### Define Your Own Scopes

```typescript
// commitlint.config.ts
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  scopes: ['api', 'ui', 'database', 'auth', 'deps'],
});
```

### Strict Configuration

```typescript
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  scopes: ['core', 'utils', 'config'],
  scopeRequired: true,
  headerMaxLength: 72,
});
```

### Ignore Specific Commits

```typescript
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  ignores: [
    (commit) => commit.startsWith('Merge'),
    (commit) => /^\[dependabot\]/.test(commit),
  ],
});
```

## Commit Message Format

This configuration enforces the Conventional Commits format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Example Commits

```text
feat(api): add user authentication endpoint
fix: correct date parsing logic
docs: update README with examples
chore(deps): update dependencies
refactor(ui): simplify form validation
test: add unit tests for utils
ci: add GitHub Actions workflow
```

## Allowed Types

| Type       | Description                           |
| ---------- | ------------------------------------- |
| `feat`     | New feature                           |
| `fix`      | Bug fix                               |
| `docs`     | Documentation changes                 |
| `chore`    | Maintenance tasks                     |
| `refactor` | Code refactoring                      |
| `test`     | Adding or updating tests              |
| `ci`       | CI/CD configuration                   |
| `perf`     | Performance improvements              |
| `style`    | Code style changes (formatting, etc.) |
| `build`    | Build system changes                  |
| `revert`   | Reverting previous commits            |

## Configuration Options

| Option             | Type                              | Default     | Description                                    |
| ------------------ | --------------------------------- | ----------- | ---------------------------------------------- |
| `scopes`           | `string[]`                        | `undefined` | Define allowed scopes (enables scope checking) |
| `additionalScopes` | `string[]`                        | `[]`        | Add scopes when extending base configs         |
| `additionalTypes`  | `string[]`                        | `[]`        | Additional commit types to allow               |
| `headerMaxLength`  | `number`                          | `100`       | Maximum length for the header line             |
| `scopeRequired`    | `boolean`                         | `false`     | Whether to require a scope                     |
| `bodyRequired`     | `boolean`                         | `false`     | Whether to require a commit body               |
| `ignores`          | `((commit: string) => boolean)[]` | `undefined` | Functions to ignore certain commits            |

## Exports

```typescript
// Default config - no scope restrictions
import config from '@jmlweb/commitlint-config';

// Factory function for custom configs
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

// Commit types constant
import { COMMIT_TYPES } from '@jmlweb/commitlint-config';
```

## Integration with Husky

### Step 1 - Install husky

```bash
pnpm add -D husky
```

### Step 2 - Initialize husky

```bash
pnpm exec husky init
```

### Step 3 - Add commit-msg hook

Create or edit `.husky/commit-msg`:

```bash
pnpm exec commitlint --edit $1
```

### Step 4 - Test your setup

```bash
# This should fail
git commit -m "bad commit message"

# This should pass
git commit -m "feat: add new feature"
```

## Requirements

- **Node.js** >= 18.0.0
- **@commitlint/cli** >= 19.0.0
- **@commitlint/config-conventional** >= 19.0.0

## Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint configuration for TypeScript
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier configuration
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration

## License

MIT
