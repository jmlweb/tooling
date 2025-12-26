# @jmlweb/commitlint-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/commitlint-config)](https://www.npmjs.com/package/@jmlweb/commitlint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Shared commitlint configuration for enforcing Conventional Commits across projects. Includes predefined scopes for @jmlweb packages and configurable options.

## Features

- Enforces [Conventional Commits](https://conventionalcommits.org) specification
- Predefined commit types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `style`, `build`, `revert`
- Predefined scopes matching @jmlweb package names
- Configurable options for custom scopes and stricter rules
- TypeScript support with full type definitions
- Easy integration with husky for Git hooks

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

Or with CommonJS:

```javascript
const commitlintConfig = require('@jmlweb/commitlint-config');

module.exports = commitlintConfig;
```

## Commit Message Format

This configuration enforces the Conventional Commits format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Examples of Valid Commits

```text
feat(eslint-config-base): add new rule for import sorting
fix(prettier-config-tailwind): correct plugin order
docs: update README with installation instructions
chore(deps): update dependencies
refactor(tsconfig-base): simplify compiler options
test(vitest-config): add unit tests for config factory
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

## Allowed Scopes

### Package Scopes

- `eslint-config-base`, `eslint-config-base-js`, `eslint-config-react`
- `prettier-config-base`, `prettier-config-tailwind`
- `tsconfig-base`, `tsconfig-internal`, `tsconfig-nextjs`, `tsconfig-react`
- `tsup-config-base`, `vite-config`, `postcss-config`
- `vitest-config`
- `commitlint-config`

### Common Scopes

- `deps` - Dependency updates
- `release` - Release-related changes
- `scripts` - Build/CI scripts
- `workspace` - Workspace configuration

## Customization

### Adding Custom Scopes

```typescript
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  additionalScopes: ['api', 'ui', 'database', 'auth'],
});
```

### Stricter Configuration

```typescript
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  scopeRequired: true,
  headerMaxLength: 72,
  bodyRequired: true,
});
```

### Adding Custom Types

```typescript
import { createCommitlintConfig } from '@jmlweb/commitlint-config';

export default createCommitlintConfig({
  additionalTypes: ['wip', 'merge'],
});
```

## Integration with Husky

### Step 1: Install husky

```bash
pnpm add -D husky
```

### Step 2: Initialize husky

```bash
pnpm exec husky init
```

### Step 3: Add commit-msg hook

Create or edit `.husky/commit-msg`:

```bash
pnpm exec commitlint --edit $1
```

### Step 4: Test your setup

```bash
# This should fail
git commit -m "bad commit message"

# This should pass
git commit -m "feat: add new feature"
```

## Configuration Options

| Option             | Type       | Default | Description                        |
| ------------------ | ---------- | ------- | ---------------------------------- |
| `additionalTypes`  | `string[]` | `[]`    | Additional commit types to allow   |
| `additionalScopes` | `string[]` | `[]`    | Additional scopes to allow         |
| `headerMaxLength`  | `number`   | `100`   | Maximum length for the header line |
| `scopeRequired`    | `boolean`  | `false` | Whether to require a scope         |
| `bodyRequired`     | `boolean`  | `false` | Whether to require a commit body   |

## Exports

### Default Export

The default export is a ready-to-use commitlint configuration:

```javascript
import config from '@jmlweb/commitlint-config';
export default config;
```

### Named Exports

```typescript
import {
  createCommitlintConfig, // Factory function for custom configs
  COMMIT_TYPES, // Array of allowed commit types
  COMMIT_SCOPES, // Array of allowed scopes
} from '@jmlweb/commitlint-config';
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
