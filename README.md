# jmlweb-tooling

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-EF4444.svg)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

Centralized configuration packages for development tools. One source of truth for consistent formatting, linting, and code quality across all projects.

## Packages

| Package                                                                   | Description                                                             | Version                                                                      |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Formatting**                                                            |                                                                         |                                                                              |
| [`@jmlweb/prettier-config-base`](./packages/prettier-config-base)         | Base Prettier configuration                                             | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-base?label=)     |
| [`@jmlweb/prettier-config-tailwind`](./packages/prettier-config-tailwind) | Prettier + Tailwind CSS plugin                                          | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind?label=) |
| **Linting**                                                               |                                                                         |                                                                              |
| [`@jmlweb/eslint-config-base`](./packages/eslint-config-base)             | ESLint for TypeScript (strict)                                          | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base?label=)       |
| [`@jmlweb/eslint-config-base-js`](./packages/eslint-config-base-js)       | ESLint for JavaScript                                                   | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base-js?label=)    |
| [`@jmlweb/eslint-config-react`](./packages/eslint-config-react)           | ESLint for React libraries with TypeScript, extending base config       | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-react?label=)      |
| **TypeScript**                                                            |                                                                         |                                                                              |
| [`@jmlweb/tsconfig-base`](./packages/tsconfig-base)                       | Base TypeScript configuration                                           | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-base?label=)            |
| [`@jmlweb/tsconfig-react`](./packages/tsconfig-react)                     | TypeScript configuration for React libraries with JSX support           | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-react?label=)           |
| **Testing**                                                               |                                                                         |                                                                              |
| [`@jmlweb/vitest-config`](./packages/vitest-config)                       | Base Vitest configuration with TypeScript support and coverage settings | ![npm](https://img.shields.io/npm/v/@jmlweb/vitest-config?label=)            |

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

## Node.js Compatibility

Different packages in this monorepo have different Node.js version requirements. Most packages work with Node.js >= 18.0.0, while some TypeScript ESLint configurations require Node.js >= 20.11.0 due to the use of `import.meta.dirname`, which was introduced in Node.js 20.11.0.

### Compatibility Matrix

| Package                            | Node.js Requirement | Reason                                      |
| ---------------------------------- | ------------------- | ------------------------------------------- |
| `@jmlweb/prettier-config-base`     | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/prettier-config-tailwind` | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/eslint-config-base-js`    | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/eslint-config-base`       | >= 20.11.0          | Uses `import.meta.dirname` for config files |
| `@jmlweb/eslint-config-react`      | >= 20.11.0          | Uses `import.meta.dirname` for config files |
| `@jmlweb/vitest-config`            | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-base`            | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-react`           | >= 18.0.0           | Standard compatibility                      |

### Why Different Requirements?

**Node.js >= 18.0.0 (Most Packages)**

- Most packages use standard JavaScript/TypeScript features available in Node.js 18.0.0
- These packages are compatible with all Node.js LTS versions

**Node.js >= 20.11.0 (TypeScript ESLint Configs)**

- `@jmlweb/eslint-config-base` and `@jmlweb/eslint-config-react` require Node.js >= 20.11.0
- These packages use `import.meta.dirname` in their configuration files, which was introduced in Node.js 20.11.0
- This feature enables better path resolution for ESLint configuration files in the flat config format

### Choosing the Right Node.js Version

- **If you're using TypeScript ESLint configs** (`@jmlweb/eslint-config-base` or `@jmlweb/eslint-config-react`):
  - Use **Node.js >= 20.11.0**
  - Recommended: Use the latest Node.js LTS version

- **If you're only using other packages** (Prettier, Vitest, or TypeScript configs):
  - Use **Node.js >= 18.0.0**
  - Recommended: Use Node.js 18 LTS or later for security updates

### Checking Your Node.js Version

```bash
node --version
```

To install or update Node.js, visit [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).

## Requirements

- **Node.js** >= 18.0.0 (see [Node.js Compatibility](#nodejs-compatibility) for package-specific requirements)
- **ESLint** >= 9.0.0 (flat config format, required for ESLint config packages)
- **Prettier** >= 3.0.0 (required for Prettier config packages)

## License

MIT
