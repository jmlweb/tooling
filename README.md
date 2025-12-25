# jmlweb-tooling

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-EF4444.svg)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

Centralized configuration packages for development tools. One source of truth for consistent formatting, linting, and code quality across all projects.

## Packages

| Package                                                                   | Description                    | Version                                                                      |
| ------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| [`@jmlweb/prettier-config-base`](./packages/prettier-config-base)         | Base Prettier configuration    | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-base?label=)     |
| [`@jmlweb/prettier-config-tailwind`](./packages/prettier-config-tailwind) | Prettier + Tailwind CSS plugin | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind?label=) |
| [`@jmlweb/eslint-config-base`](./packages/eslint-config-base)             | ESLint for TypeScript (strict) | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base?label=)       |
| [`@jmlweb/eslint-config-base-js`](./packages/eslint-config-base-js)       | ESLint for JavaScript          | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base-js?label=)    |
| [`@jmlweb/tsconfig-base`](./packages/tsconfig-base)                       | Base TypeScript configuration  | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-base?label=)            |

## Quick Start

### Prettier

```bash
npm install --save-dev @jmlweb/prettier-config-base prettier
```

```json
{
  "prettier": "@jmlweb/prettier-config-base"
}
```

### ESLint (TypeScript)

```bash
npm install --save-dev @jmlweb/eslint-config-base eslint typescript-eslint
```

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [...baseConfig];
```

## Package Hierarchy

```text
prettier-config-base ─────► prettier-config-tailwind
                                    │
                                    └── + Tailwind CSS plugin

eslint-config-base-js ────► eslint-config-base
                                    │
                                    └── + TypeScript strict rules
```

## Development

```bash
# Install dependencies
npm install

# Format code
npm run format

# Run linting
npm run lint

# Run tests (validates all packages)
npm run test

# Validate everything (format check + lint)
npm run validate
```

The `apps/test-app/` directory contains a test application that validates all configuration packages work correctly.

## Requirements

- **Node.js** >= 18.0.0 (ESLint TypeScript config requires >= 20.11.0)
- **ESLint** >= 9.0.0 (flat config format)
- **Prettier** >= 3.0.0

## License

MIT
