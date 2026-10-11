# @jmlweb/jest-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/jest-config)](https://www.npmjs.com/package/@jmlweb/jest-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Jest-29%2B-C21325.svg)](https://jestjs.io/)

> Jest configuration with ts-jest, coverage thresholds and sensible defaults.

> 🛠️ **Maintenance mode**: dependency and security updates only. New projects should use [`@jmlweb/vitest-config`](../vitest-config).

## ✨ Features

- 🔧 **TypeScript**: ts-jest transform out of the box
- 📊 **Coverage**: 80% global thresholds, text/json/html reporters
- 🎯 **Sensible defaults**: Node environment, mocks cleared and restored between tests
- 🚀 **Configurable**: `createJestConfig()` factory with typed options

## 📦 Installation

```bash
npm install --save-dev @jmlweb/jest-config jest ts-jest @types/jest
```

> 💡 Upgrading? See the [Migration Guide](#-migration-guide).

## 🚀 Quick Start

```javascript
// jest.config.mjs
import jestConfig from '@jmlweb/jest-config';

export default jestConfig;
```

With a TypeScript config file (`jest.config.ts`), Jest also needs `ts-node`.

## 💡 Examples

### Factory with options

```javascript
// jest.config.mjs
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
});
```

`jsdom` needs `jest-environment-jsdom` installed.

### Custom coverage thresholds

```javascript
import { createJestConfig } from '@jmlweb/jest-config';

export default createJestConfig({
  coverageThreshold: {
    global: { lines: 90, functions: 90, branches: 85, statements: 90 },
  },
});
```

### Spread the base config

```javascript
import jestConfig from '@jmlweb/jest-config';

export default {
  ...jestConfig,
  testTimeout: 10000,
};
```

## 📋 Configuration Details

`createJestConfig(options)` options and defaults:

| Option                       | Default                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `testEnvironment`            | `'node'`                                                                             |
| `moduleFileExtensions`       | `['ts', 'tsx', 'js', 'jsx', 'json']`                                                 |
| `testMatch`                  | `['**/*.{test,spec}.{ts,tsx,js,jsx}']`                                               |
| `testPathIgnorePatterns`     | `/node_modules/`, `/dist/`, `/build/`, `/.git/`, `/.cache/`                          |
| `collectCoverageFrom`        | `['src/**/*.{ts,tsx,js,jsx}']`                                                       |
| `coveragePathIgnorePatterns` | node_modules, dist, build, coverage, `.d.ts`, config, test and spec files            |
| `coverageThreshold`          | `global`: 80 for lines, functions, branches, statements                              |
| `coverageReporters`          | `['text', 'json', 'html']`                                                           |
| `setupFilesAfterEnv`         | `[]` (omitted when empty)                                                            |
| `moduleNameMapper`           | `{}` (omitted when empty)                                                            |
| `transform`                  | `ts-jest` for `.ts`/`.tsx` with `esModuleInterop` and `allowSyntheticDefaultImports` |
| `testTimeout`                | `5000`                                                                               |

Fixed settings: `collectCoverage: false` (use `--coverage`), `verbose: true`, `clearMocks: true`, `restoreMocks: true`, `resetModules: false`.

## 🎯 When to Use

- ✅ Existing Jest projects with TypeScript
- ✅ Shared coverage baseline

Not for you if you are starting a new project: use [`@jmlweb/vitest-config`](../vitest-config).

## 🔧 Extending the Configuration

Pass options to `createJestConfig`, or spread the result and override. Passing `transform` replaces the default entirely, so include the `ts-jest` entry again if you still need it.

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Jest** >= 29.0.0
- **ts-jest** >= 29.0.0

## 📦 Peer Dependencies

- `jest` (`>=29.0.0`)
- `ts-jest` (`>=29.0.0`)
- `@types/jest` (`>=29.0.0`)

## 🔗 Related Packages

- [`@jmlweb/vitest-config`](../vitest-config) - Recommended replacement
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/oxlint-config-base`](../oxlint-config-base) - Oxlint config

## 🔄 Migration Guide

### 1.x to 2.0

**Breaking:** Node.js >= 22.12.0 is required.

1. Upgrade Node.js to 22.12.0 or later.
2. Update: `npm install --save-dev @jmlweb/jest-config@latest`

See the [Changelog](./CHANGELOG.md) for details.

## 📄 License

MIT
