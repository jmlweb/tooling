# @jmlweb/tsup-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsup-config-base)](https://www.npmjs.com/package/@jmlweb/tsup-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![tsup](https://img.shields.io/badge/tsup-8.0%2B-yellow.svg)](https://tsup.egoist.dev/)

> [!WARNING]
> **Deprecated and no longer maintained.** tsup is maintenance-only and recommends tsdown. Use [`@jmlweb/tsdown-config-base`](../tsdown-config-base): same helper API and published file names, with a [migration guide](../tsdown-config-base#from-jmlwebtsup-config-base).

> Base tsup configuration for jmlweb projects, with sensible defaults for TypeScript libraries and CLIs.

## ✨ Features

- 🎯 **Sensible defaults**: Pre-configured for TypeScript libraries
- 📦 **Dual format**: CommonJS and ESM output by default
- 📝 **Declarations**: `.d.ts` generation enabled
- 🖥️ **CLI preset**: Shebang support
- 🛠️ **Fully typed**: Exported option types

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsup-config-base tsup
```

## 🚀 Quick Start

Create `tsup.config.ts` in your project root:

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig();
```

## 💡 Examples

### External Dependencies

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  external: ['@jmlweb/eslint-config-base-js', '@eslint/js', 'eslint'],
});
```

### Multiple Entries and Extra Options

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  entry: { index: 'src/index.ts', utils: 'src/utils/index.ts' },
  external: ['commander'],
  options: {
    minify: true,
    sourcemap: true,
  },
});
```

### CLI Package

```typescript
import { createTsupCliConfig } from '@jmlweb/tsup-config-base';

export default createTsupCliConfig();
// Output: dist/cli.js with a #!/usr/bin/env node shebang
```

### CLI with Library API

```typescript
import { createTsupCliConfig } from '@jmlweb/tsup-config-base';

export default createTsupCliConfig({
  entry: { cli: 'src/cli.ts', index: 'src/index.ts' },
  shebang: 'cli', // Only the cli entry gets a shebang
  external: ['commander'],
});
```

## 📋 Configuration Details

### `createTsupConfig(options?): Options`

| Option     | Type                                 | Default            | Description                      |
| ---------- | ------------------------------------ | ------------------ | -------------------------------- |
| `entry`    | `string[] \| Record<string, string>` | `['src/index.ts']` | Entry point files                |
| `format`   | `('cjs' \| 'esm' \| 'iife')[]`       | `['cjs', 'esm']`   | Output formats                   |
| `dts`      | `boolean`                            | `true`             | Generate declaration files       |
| `clean`    | `boolean`                            | `true`             | Clean output before build        |
| `outDir`   | `string`                             | `'dist'`           | Output directory                 |
| `external` | `(string \| RegExp)[]`               | `[]`               | Packages to exclude from bundle  |
| `options`  | `Partial<Options>`                   | `{}`               | Additional tsup options to merge |

### `createTsupCliConfig(options?): Options | Options[]`

Same options, with `format` defaulting to `['esm']` and `entry` to `{ cli: 'src/cli.ts' }`, plus:

| Option    | Type                            | Default    | Description                                       |
| --------- | ------------------------------- | ---------- | ------------------------------------------------- |
| `target`  | `NodeTarget`                    | `'node18'` | Node.js target version                            |
| `shebang` | `boolean \| string \| string[]` | `true`     | Shebang on all entries (`true`) or the named ones |

Returns an array of configs when a selective shebang is used.

### Exports

- `createTsupConfig`, `createTsupCliConfig` - Helpers
- `BASE_DEFAULTS`, `CLI_DEFAULTS` - Default values
- `TsupConfigOptions`, `TsupCliConfigOptions`, `EntryConfig`, `NodeTarget` - Types
- `Options` - Re-exported from tsup

## 🎯 When to Use

**Do not use for new projects.** Use [`@jmlweb/tsdown-config-base`](../tsdown-config-base) instead.

Only keep this package while you have not yet migrated an existing tsup-based build.

## 🔧 Extending the Configuration

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  format: ['esm'], // ESM only
  dts: false, // No type declarations
  outDir: 'build',
  external: ['vitest'], // Peer, workspace and optional dependencies
  options: {
    minify: true,
    splitting: true,
    target: 'es2022',
  },
});
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "build": "tsup",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run build"
  }
}
```

```bash
npm run build  # Build the package
npm run clean  # Clean build output
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **tsup** >= 8.0.0

## 📦 Peer Dependencies

- `tsup` (>=8.0.0)

## 🔗 Related Packages

- [`@jmlweb/tsdown-config-base`](../tsdown-config-base) - Successor to this package (recommended)
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration
- [tsup](https://tsup.egoist.dev/) - TypeScript bundler powered by esbuild

## 🔄 Migration Guide

### From 1.x to 2.0.0

**Breaking:** Node.js >= 22.12.0 is required (18 and 20 are end-of-life).

### To `@jmlweb/tsdown-config-base`

Follow the [migration guide](../tsdown-config-base#from-jmlwebtsup-config-base).

See the [Changelog](./CHANGELOG.md) for version history.

## 📄 License

MIT
