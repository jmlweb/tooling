# @jmlweb/vitest-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/vitest-config)](https://www.npmjs.com/package/@jmlweb/vitest-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1.0%2B-6E9F18.svg)](https://vitest.dev/)

> Base Vitest configuration for jmlweb projects. TypeScript support, coverage settings, and sensible defaults out of the box.

## ✨ Features

- 🔧 **TypeScript Support**: Configured for TypeScript projects (type checking via CLI)
- 📊 **Coverage Configuration**: Pre-configured with v8 provider and 80% coverage thresholds
- 🎯 **Sensible Defaults**: Node.js environment, globals enabled, optimized test execution
- ⚡ **Performance Optimized**: Thread pool configuration for efficient parallel test execution
- 🚀 **Easy Extension**: Flat config format for easy customization
- 📦 **Zero Config**: Works out of the box with minimal setup

## 📦 Installation

```bash
pnpm add -D @jmlweb/vitest-config vitest
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

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

| Setting                          | Value     | Description                                          |
| -------------------------------- | --------- | ---------------------------------------------------- |
| `globals`                        | `true`    | Enables global test functions (describe, it, expect) |
| `environment`                    | `node`    | Node.js environment by default                       |
| `testTimeout`                    | `5000`    | Test timeout in milliseconds (5 seconds)             |
| `hookTimeout`                    | `10000`   | Hook timeout in milliseconds (10 seconds)            |
| `pool`                           | `threads` | Use thread pool for parallel test execution          |
| `coverage.provider`              | `v8`      | Coverage provider                                    |
| `coverage.thresholds.lines`      | `80`      | Minimum line coverage                                |
| `coverage.thresholds.functions`  | `80`      | Minimum function coverage                            |
| `coverage.thresholds.branches`   | `80`      | Minimum branch coverage                              |
| `coverage.thresholds.statements` | `80`      | Minimum statement coverage                           |

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

**Test Reporters:**

- `verbose` - Detailed test output with full test names and results

**Coverage Reporters:**

- `text` - Text summary in terminal
- `json` - JSON format for CI/CD integration
- `html` - HTML coverage report (generated in `coverage/` directory)

## 🎯 When to Use

Use this configuration when you want:

- ✅ Consistent testing setup across projects
- ✅ TypeScript support out of the box
- ✅ Coverage thresholds enforced
- ✅ Optimized test execution with thread pool
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
    "test:ui": "vitest --ui",
    "test:typecheck": "vitest typecheck"
  }
}
```

Then run:

```bash
pnpm test           # Run tests in watch mode
pnpm test:run       # Run tests once
pnpm test:coverage  # Run tests with coverage
pnpm test:ui        # Open Vitest UI
pnpm test:typecheck # Run TypeScript type checking
```

### TypeScript Type Checking

Type checking is performed separately using the `vitest typecheck` command for better performance. This allows you to run type checking independently of your test suite:

```bash
# Run type checking only
pnpm test:typecheck

# Or run tests and type checking together
pnpm test && pnpm test:typecheck
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Vitest** >= 1.0.0
- **TypeScript** project (recommended, but not required)

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `vitest` (^1.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API with testing
- [`example-react-typescript-app`](../../apps/example-react-typescript-app) - React TypeScript app with component testing

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/jest-config`](../jest-config) - Jest configuration (alternative test runner)
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration

### External Tools

- [Vitest](https://vitest.dev/) - Blazing-fast unit test framework powered by Vite
- [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) - Custom matchers for the DOM (works with Vitest)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - React testing utilities (for React projects)
- [@vitest/ui](https://vitest.dev/guide/ui.html) - Visual UI for Vitest test results

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### Module Resolution Issues

**Symptoms:**

- Error: "Cannot find module" when running tests
- Import paths work in the app but fail in tests

**Cause:**

- Vitest uses Vite's module resolution which may differ from TypeScript
- Path aliases or special imports not configured for tests

**Solution:**

If you're using path aliases in `tsconfig.json`, configure them in your Vitest config:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vitestConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...vitestConfig,
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
});
```

### jsdom or happy-dom Not Found

**Symptoms:**

- Error: "Environment 'jsdom' not found" or "Environment 'happy-dom' not found"
- Tests fail to run with DOM-related errors

**Cause:**

- The test environment package is not installed
- This config specifies the environment but doesn't install it (peer dependency)

**Solution:**

Install the DOM environment package:

```bash
# For jsdom (more compatible, slower)
pnpm add -D jsdom

# Or for happy-dom (faster, less compatible)
pnpm add -D happy-dom
```

Then specify in your config if different from default:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vitestConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...vitestConfig,
  test: {
    ...vitestConfig.test,
    environment: 'jsdom', // or 'happy-dom'
  },
});
```

### Coverage Not Working

**Symptoms:**

- No coverage reports generated
- Coverage command runs but shows no output

**Cause:**

- Coverage provider not installed
- Coverage not enabled in configuration

**Solution:**

Install the coverage provider:

```bash
pnpm add -D @vitest/coverage-v8
```

Run tests with coverage flag:

```bash
vitest --coverage
```

### Test Files Not Found

**Symptoms:**

- "No test files found" even though test files exist
- Vitest doesn't pick up `*.test.ts` or `*.spec.ts` files

**Cause:**

- Test file pattern mismatch
- Files in excluded directories

**Solution:**

This config includes common patterns. If your tests aren't found, check:

1. File naming: Use `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx`
2. Location: Ensure tests aren't in `node_modules` or `dist`
3. Explicitly include test patterns:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vitestConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...vitestConfig,
  test: {
    ...vitestConfig.test,
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
});
```

## 🔄 Migration Guide

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

**No breaking changes have been introduced yet.** This package follows semantic versioning. When breaking changes are introduced, detailed migration instructions will be provided here.

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
