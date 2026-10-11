# @jmlweb/vitest-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/vitest-config)](https://www.npmjs.com/package/@jmlweb/vitest-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1.0%2B-6E9F18.svg)](https://vitest.dev/)

> Base Vitest configuration with TypeScript-friendly defaults, v8 coverage and 80% thresholds.

## ✨ Features

- 📊 **Coverage**: v8 provider with 80% thresholds
- 🎯 **Sensible defaults**: Node environment, globals enabled, verbose reporter
- ⚡ **Fast**: thread pool by default
- 🔀 **Dual format**: ESM and CommonJS builds

## 📦 Installation

```bash
npm install --save-dev @jmlweb/vitest-config vitest @vitest/coverage-v8
```

`@vitest/coverage-v8` is needed for `--coverage`; use the same version as `vitest`.

> 💡 Upgrading? See the [Migration Guide](#-migration-guide).

## 🚀 Quick Start

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
});
```

Everything lives under `test`. A `test` key in your config **replaces** the whole base `test` block, so spread `...baseConfig.test` into it, or use `mergeConfig`:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default mergeConfig(
  baseConfig,
  defineConfig({ test: { environment: 'jsdom' } }),
);
```

## 💡 Examples

### Overrides

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 10000,
  },
});
```

### Custom coverage thresholds

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    coverage: {
      ...baseConfig.test?.coverage,
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
  },
});
```

### Explicit imports, no thresholds

Import `describe`, `it` and `expect` yourself and report coverage without failing the run:

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@jmlweb/vitest-config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    globals: false,
    coverage: { ...baseConfig.test?.coverage, thresholds: {} },
  },
});
```

## 📋 Configuration Details

| Setting                       | Value                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `globals`                     | `true`                                                       |
| `environment`                 | `'node'`                                                     |
| `testTimeout` / `hookTimeout` | `5000` / `10000` ms                                          |
| `pool`                        | `'threads'`                                                  |
| `reporters`                   | `['verbose']`                                                |
| `include`                     | `**/*.{test,spec}.{ts,tsx,js,jsx}`                           |
| `exclude`                     | `node_modules`, `dist`, `build`, dot-dirs, tool config files |
| `coverage.provider`           | `'v8'`                                                       |
| `coverage.thresholds`         | `80` for lines, functions, branches, statements              |
| `coverage.include`            | `src/**/*.{ts,tsx,js,jsx}`                                   |
| `coverage.reporter`           | `['text', 'json', 'html']`                                   |

Coverage excludes `*.d.ts`, `*.config.{ts,js}`, `dist`, `build`, `node_modules`, `coverage`, and test/spec files.

## 🎯 When to Use

- ✅ Vitest-based TypeScript projects
- ✅ Enforced coverage with a shared baseline
- ✅ Node.js libraries, CLIs and APIs, or browser code with `environment: 'jsdom'`

Not for you if you use Jest: see [`@jmlweb/jest-config`](../jest-config) (maintenance mode).

## 🔧 Extending the Configuration

Spread `baseConfig.test` and override what you need (see [Examples](#-examples)). Install `jsdom` or `happy-dom` yourself when you set `environment` to either.

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:typecheck": "vitest typecheck"
  }
}
```

```bash
npm test                  # watch mode
npm run test:coverage     # single run with coverage
```

Type checking is not part of the config: run `vitest typecheck` separately.

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Vitest** >= 1.0.0 (config targets Vitest 4)

## 📦 Peer Dependencies

- `vitest` (`>=1.0.0`)

## 🔗 Related Packages

- [`@jmlweb/vite-config`](../vite-config) - Vite base config
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/oxlint-config-base`](../oxlint-config-base) - Oxlint config
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt config
- [`@jmlweb/jest-config`](../jest-config) - Jest alternative (maintenance mode)

## 🔄 Migration Guide

### 2.x to 3.0

**Breaking:** Node.js >= 22.12.0 is required.

1. Upgrade Node.js to 22.12.0 or later.
2. Update: `npm install --save-dev @jmlweb/vitest-config@latest`

### 1.x to 2.0

Vitest 4: `poolOptions.threads.minThreads` and `maxThreads` are gone; Vitest manages the pool automatically.

See the [Changelog](./CHANGELOG.md) for details.

## 📄 License

MIT
