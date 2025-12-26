# @jmlweb/tsup-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsup-config-base)](https://www.npmjs.com/package/@jmlweb/tsup-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![tsup](https://img.shields.io/badge/tsup-8.0%2B-yellow.svg)](https://tsup.egoist.dev/)

> Base tsup configuration for jmlweb projects. Provides sensible defaults and a clean API for creating consistent build configurations.

## Features

- **Sensible Defaults**: Pre-configured with common settings for TypeScript libraries
- **Dual Format**: Generates both CommonJS and ESM outputs by default
- **TypeScript Declarations**: Automatic `.d.ts` generation enabled
- **Clean API**: Simple function to create configurations with external dependencies
- **Zero Config**: Works out of the box with minimal setup
- **Fully Typed**: Complete TypeScript support with exported types

## Installation

```bash
npm install --save-dev @jmlweb/tsup-config-base tsup
```

## Quick Start

Create a `tsup.config.ts` file in your project root:

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig();
```

## Examples

### Basic Setup (No Externals)

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig();
```

### With External Dependencies

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  external: ['eslint', 'typescript-eslint', '@eslint/js'],
});
```

### With Internal Workspace Dependencies

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  external: [
    // Internal packages
    '@jmlweb/eslint-config-base-js',
    // External peer dependencies
    '@eslint/js',
    'eslint',
    'eslint-config-prettier',
    'typescript-eslint',
  ],
});
```

### Custom Entry Point

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  entry: ['src/main.ts'],
  external: ['some-dependency'],
});
```

### With Additional Options

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  external: ['vitest'],
  options: {
    minify: true,
    sourcemap: true,
    splitting: true,
  },
});
```

### Multiple Entry Points

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  external: ['commander'],
});
```

## Configuration Details

### Default Settings

| Setting    | Default Value      | Description                         |
| ---------- | ------------------ | ----------------------------------- |
| `entry`    | `['src/index.ts']` | Entry point(s) for the build        |
| `format`   | `['cjs', 'esm']`   | Output formats (dual publishing)    |
| `dts`      | `true`             | Generate TypeScript declarations    |
| `clean`    | `true`             | Clean output directory before build |
| `outDir`   | `'dist'`           | Output directory                    |
| `external` | `[]`               | External packages to exclude        |

### API Reference

#### `createTsupConfig(options?: TsupConfigOptions): Options`

Creates a tsup configuration with sensible defaults.

**Parameters:**

| Option     | Type                           | Default            | Description                      |
| ---------- | ------------------------------ | ------------------ | -------------------------------- |
| `entry`    | `string[]`                     | `['src/index.ts']` | Entry point files                |
| `format`   | `('cjs' \| 'esm' \| 'iife')[]` | `['cjs', 'esm']`   | Output formats                   |
| `dts`      | `boolean`                      | `true`             | Generate declaration files       |
| `clean`    | `boolean`                      | `true`             | Clean output before build        |
| `outDir`   | `string`                       | `'dist'`           | Output directory                 |
| `external` | `(string \| RegExp)[]`         | `[]`               | Packages to exclude from bundle  |
| `options`  | `Partial<Options>`             | `{}`               | Additional tsup options to merge |

**Returns:** A complete tsup `Options` object.

#### `BASE_DEFAULTS`

Exported constant containing the default configuration values for reference.

#### `Options` (re-exported from tsup)

The tsup Options type is re-exported for convenience when extending configurations.

## When to Use

Use this configuration when you want:

- Consistent build configuration across multiple packages
- Dual-format output (CommonJS + ESM) for maximum compatibility
- Automatic TypeScript declaration generation
- A clean, simple API for specifying externals
- Easy customization without repeating boilerplate

## Externals Strategy

When configuring `external`, include:

1. **Peer dependencies**: Packages that consumers should install themselves
2. **Workspace dependencies**: Internal `@jmlweb/*` packages used via `workspace:*`
3. **Optional dependencies**: Packages that may or may not be present

```typescript
// Example: ESLint config package
export default createTsupConfig({
  external: [
    // Internal workspace dependency
    '@jmlweb/eslint-config-base-js',
    // Peer dependencies
    '@eslint/js',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-simple-import-sort',
    'typescript-eslint',
  ],
});
```

## Usage with Scripts

Add build scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "tsup",
    "clean": "rm -rf dist",
    "prepublishOnly": "pnpm build"
  }
}
```

Then run:

```bash
npm run build    # Build the package
npm run clean    # Clean build output
```

## Requirements

- **Node.js** >= 18.0.0
- **tsup** >= 8.0.0

## Peer Dependencies

This package requires the following peer dependency:

- `tsup` (>=8.0.0)

## Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration for testing

## License

MIT
