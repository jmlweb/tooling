# @jmlweb/jest-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/jest-config)](https://www.npmjs.com/package/@jmlweb/jest-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.11.0-339933.svg)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Jest-29.0%2B-C21325.svg)](https://jestjs.io/)
[![ts-jest](https://img.shields.io/badge/ts--jest-29.0%2B-C21325.svg)](https://kulshekhar.github.io/ts-jest/)

> Base Jest configuration for jmlweb projects. TypeScript support, coverage settings, and sensible defaults out of the box.

## ✨ Features

- 🔧 **TypeScript Support**: Configured for TypeScript projects with ts-jest
- 📊 **Coverage Configuration**: Pre-configured with 80% coverage thresholds
- 🎯 **Sensible Defaults**: Node.js environment, optimized test execution, clear mocks
- ⚡ **Performance Optimized**: Efficient test execution with proper module isolation
- 🚀 **Easy Extension**: Factory function for easy customization
- 📦 **Zero Config**: Works out of the box with minimal setup

## 📦 Installation

```bash
npm install --save-dev @jmlweb/jest-config jest ts-jest @types/jest
```

## 🚀 Quick Start

Create a `jest.config.ts` file in your project root:

```typescript
import jestConfig from '@jmlweb/jest-config';

export default jestConfig;
```

Or use the factory function for customization:

```typescript
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
});
```

## 💡 Examples

### Basic Setup

```typescript
// jest.config.ts
import jestConfig from '@jmlweb/jest-config';

export default jestConfig;
```

### With Project-Specific Overrides

```typescript
// jest.config.ts
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 10000,
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
  },
});
```

### React/JSX Project Example

```typescript
// jest.config.ts
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});
```

### Lower Coverage Thresholds

```typescript
// jest.config.ts
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  coverageThreshold: {
    global: {
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60,
    },
  },
});
```

### Custom Test Patterns

```typescript
// jest.config.ts
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
});
```

## 📋 Configuration Details

### Default Settings

| Setting                               | Value                                  | Description                              |
| ------------------------------------- | -------------------------------------- | ---------------------------------------- |
| `testEnvironment`                     | `node`                                 | Node.js environment by default           |
| `moduleFileExtensions`                | `['ts', 'tsx', 'js', 'jsx', 'json']`   | Supported file extensions                |
| `testMatch`                           | `['**/*.{test,spec}.{ts,tsx,js,jsx}']` | Test file patterns                       |
| `testTimeout`                         | `5000`                                 | Test timeout in milliseconds (5 seconds) |
| `coverageThreshold.global.lines`      | `80`                                   | Minimum line coverage                    |
| `coverageThreshold.global.functions`  | `80`                                   | Minimum function coverage                |
| `coverageThreshold.global.branches`   | `80`                                   | Minimum branch coverage                  |
| `coverageThreshold.global.statements` | `80`                                   | Minimum statement coverage               |
| `verbose`                             | `true`                                 | Detailed test output                     |
| `clearMocks`                          | `true`                                 | Clear mocks between tests                |
| `restoreMocks`                        | `true`                                 | Restore mocks after each test            |

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

### Coverage Reporters

- `text` - Text summary in terminal
- `json` - JSON format for CI/CD integration
- `html` - HTML coverage report (generated in `coverage/` directory)

## 🎯 When to Use

Use this configuration when you want:

- ✅ Consistent testing setup across projects using Jest
- ✅ TypeScript support out of the box
- ✅ Coverage thresholds enforced
- ✅ Sensible defaults for Node.js and browser projects
- ✅ Easy customization and extension

**For projects using Vitest**, use [`@jmlweb/vitest-config`](../vitest-config) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```typescript
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  // Add custom setup files
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // Custom test patterns
  testMatch: ['**/*.test.ts', '**/__tests__/**/*.ts'],

  // Custom environment
  testEnvironment: 'jsdom',

  // Path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
});
```

## 📝 Usage with Scripts

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

Then run:

```bash
npm run test           # Run tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run test:ci        # Run tests in CI mode
```

### TypeScript Configuration

The configuration uses `ts-jest` for TypeScript support. The default transform configuration includes:

- `esModuleInterop: true` - Allows default imports from CommonJS modules
- `allowSyntheticDefaultImports: true` - Allows default imports from modules with no default export

These settings ensure compatibility with modern TypeScript projects.

## 📋 Requirements

- **Node.js** >= 20.11.0
- **Jest** >= 29.0.0
- **ts-jest** >= 29.0.0
- **@types/jest** >= 29.0.0
- **TypeScript** project (recommended, but not required)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `jest` (>=29.0.0)
- `ts-jest` (>=29.0.0)
- `@types/jest` (>=29.0.0)

## 🔗 Related Packages

- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration for modern testing
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
