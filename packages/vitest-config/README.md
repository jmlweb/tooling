# @jmlweb/vitest-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/vitest-config)](https://www.npmjs.com/package/@jmlweb/vitest-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1.0%2B-6E9F18.svg)](https://vitest.dev/)

> Base Vitest configuration for jmlweb projects. TypeScript support, coverage settings, and sensible defaults out of the box.

## ✨ Features

- 🔧 **TypeScript Support**: Configured for TypeScript projects with type checking enabled
- 📊 **Coverage Configuration**: Pre-configured with v8 provider and 80% coverage thresholds
- 🎯 **Sensible Defaults**: Node.js environment, globals enabled, standard reporters
- 🚀 **Easy Extension**: Flat config format for easy customization
- 📦 **Zero Config**: Works out of the box with minimal setup

## 📦 Installation

```bash
npm install --save-dev @jmlweb/vitest-config vitest
```

## 🚀 Quick Start

Create a `vitest.config.ts` file in your project root:

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  // Add your project-specific overrides here
});
```

## 💡 Examples

### Basic Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
});
```

### With Project-Specific Overrides

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    // Override environment for browser testing
    environment: 'jsdom',
    // Custom test timeout
    testTimeout: 10000,
    // Custom coverage thresholds
    coverage: {
      ...baseConfig.test?.coverage,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
```

### React/JSX Project Example

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom', // Use jsdom for React component testing
    setupFiles: ['./src/test/setup.ts'], // Optional setup file
  },
});
```

### Lower Coverage Thresholds

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    coverage: {
      ...baseConfig.test?.coverage,
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});
```

## 📋 Configuration Details

### Default Settings

| Setting                          | Value  | Description                                          |
| -------------------------------- | ------ | ---------------------------------------------------- |
| `globals`                        | `true` | Enables global test functions (describe, it, expect) |
| `environment`                    | `node` | Node.js environment by default                       |
| `coverage.provider`              | `v8`   | Coverage provider                                    |
| `coverage.thresholds.lines`      | `80`   | Minimum line coverage                                |
| `coverage.thresholds.functions`  | `80`   | Minimum function coverage                            |
| `coverage.thresholds.branches`   | `80`   | Minimum branch coverage                              |
| `coverage.thresholds.statements` | `80`   | Minimum statement coverage                           |
| `typecheck.enabled`              | `true` | Enable TypeScript type checking                      |

### Coverage Exclusions

The following patterns are excluded from coverage by default:

- `**/*.d.ts` - TypeScript declaration files
- `**/*.config.{ts,js}` - Configuration files
- `**/dist/**` - Build output
- `**/build/**` - Build directories
- `**/node_modules/**` - Dependencies
- `**/coverage/**` - Coverage reports
- `**/*.test.{ts,tsx,js,jsx}` - Test files
- `**/*.spec.{ts,tsx,js,jsx}` - Spec files

### Test File Patterns

Tests are automatically discovered from:

- `**/*.test.{ts,tsx,js,jsx}`
- `**/*.spec.{ts,tsx,js,jsx}`

### Reporters

Default reporters include:

- `verbose` - Detailed test output
- `json` - JSON format for CI/CD
- `html` - HTML coverage report

## 🎯 When to Use

Use this configuration when you want:

- ✅ Consistent testing setup across projects
- ✅ TypeScript support out of the box
- ✅ Coverage thresholds enforced
- ✅ Sensible defaults for Node.js projects
- ✅ Easy customization and extension

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    // Add custom setup files
    setupFiles: ['./src/test/setup.ts'],
    // Custom test patterns
    include: ['**/*.test.ts', '**/__tests__/**/*.ts'],
    // Custom environment
    environment: 'jsdom',
  },
});
```

## 📝 Usage with Scripts

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Vitest** >= 1.0.0
- **TypeScript** project (recommended, but not required)

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `vitest` (^1.0.0)

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration

## 📄 License

MIT
