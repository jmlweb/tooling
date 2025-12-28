# @jmlweb/tsup-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsup-config-base)](https://www.npmjs.com/package/@jmlweb/tsup-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![tsup](https://img.shields.io/badge/tsup-8.0%2B-yellow.svg)](https://tsup.egoist.dev/)

> Base tsup configuration for jmlweb projects. Provides sensible defaults and a clean API for creating consistent build configurations.

## ✨ Features

- 🎯 **Sensible Defaults**: Pre-configured with common settings for TypeScript libraries
- 📦 **Dual Format**: Generates both CommonJS and ESM outputs by default
- 📝 **TypeScript Declarations**: Automatic `.d.ts` generation enabled
- 🔧 **Clean API**: Simple function to create configurations with external dependencies
- ⚡ **Zero Config**: Works out of the box with minimal setup
- 🛠️ **Fully Typed**: Complete TypeScript support with exported types
- 🖥️ **CLI Preset**: Specialized configuration for CLI packages with shebang support

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsup-config-base tsup
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create a `tsup.config.ts` file in your project root:

```typescript
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig();
```

## 💡 Examples

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

### Object-Style Entry Points

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  entry: {
    index: 'src/index.ts',
    utils: 'src/utils/index.ts',
  },
});
```

### CLI Package Configuration

For CLI packages that need shebang injection, use `createTsupCliConfig`:

```typescript
// tsup.config.ts
import { createTsupCliConfig } from '@jmlweb/tsup-config-base';

export default createTsupCliConfig();
// Output: dist/cli.js with #!/usr/bin/env node shebang
```

### CLI with Custom Entry

```typescript
// tsup.config.ts
import { createTsupCliConfig } from '@jmlweb/tsup-config-base';

export default createTsupCliConfig({
  entry: { bin: 'src/bin.ts' },
  external: ['commander'],
});
```

### CLI with Library API

```typescript
// tsup.config.ts
import { createTsupCliConfig } from '@jmlweb/tsup-config-base';

export default createTsupCliConfig({
  entry: {
    cli: 'src/cli.ts',
    index: 'src/index.ts',
  },
  shebang: 'cli', // Only add shebang to cli entry
  external: ['commander'],
});
```

## 📋 Configuration Details

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

Creates a tsup configuration with sensible defaults for library packages.

**Parameters:**

| Option     | Type                                 | Default            | Description                      |
| ---------- | ------------------------------------ | ------------------ | -------------------------------- |
| `entry`    | `string[] \| Record<string, string>` | `['src/index.ts']` | Entry point files                |
| `format`   | `('cjs' \| 'esm' \| 'iife')[]`       | `['cjs', 'esm']`   | Output formats                   |
| `dts`      | `boolean`                            | `true`             | Generate declaration files       |
| `clean`    | `boolean`                            | `true`             | Clean output before build        |
| `outDir`   | `string`                             | `'dist'`           | Output directory                 |
| `external` | `(string \| RegExp)[]`               | `[]`               | Packages to exclude from bundle  |
| `options`  | `Partial<Options>`                   | `{}`               | Additional tsup options to merge |

**Returns:** A complete tsup `Options` object.

#### `createTsupCliConfig(options?: TsupCliConfigOptions): Options | Options[]`

Creates a CLI-specific tsup configuration with shebang support.

**Parameters:**

| Option     | Type                                 | Default                 | Description                                 |
| ---------- | ------------------------------------ | ----------------------- | ------------------------------------------- |
| `entry`    | `string[] \| Record<string, string>` | `{ cli: 'src/cli.ts' }` | Entry point files                           |
| `format`   | `('cjs' \| 'esm' \| 'iife')[]`       | `['esm']`               | Output formats (ESM only by default)        |
| `dts`      | `boolean`                            | `true`                  | Generate declaration files                  |
| `clean`    | `boolean`                            | `true`                  | Clean output before build                   |
| `outDir`   | `string`                             | `'dist'`                | Output directory                            |
| `external` | `(string \| RegExp)[]`               | `[]`                    | Packages to exclude from bundle             |
| `target`   | `NodeTarget`                         | `'node18'`              | Node.js target version                      |
| `shebang`  | `boolean \| string \| string[]`      | `true`                  | Add shebang to entries (true = all entries) |
| `options`  | `Partial<Options>`                   | `{}`                    | Additional tsup options to merge            |

**Returns:** A tsup `Options` object, or an array of `Options` when selective shebang is used.

#### Exported Constants

- `BASE_DEFAULTS` - Default library configuration values
- `CLI_DEFAULTS` - Default CLI configuration values
- `Options` - Re-exported from tsup

#### Type Exports

- `EntryConfig` - Entry point configuration type (`string[] | Record<string, string>`)
- `NodeTarget` - Node.js target version type (`'node16' | 'node18' | 'node20' | 'node22' | ...`)
- `TsupConfigOptions` - Options for `createTsupConfig`
- `TsupCliConfigOptions` - Options for `createTsupCliConfig`

## 🎯 When to Use

Use this configuration when you want:

- ✅ Consistent build configuration across multiple packages
- ✅ Dual-format output (CommonJS + ESM) for maximum compatibility
- ✅ Automatic TypeScript declaration generation
- ✅ A clean, simple API for specifying externals
- ✅ Easy customization without repeating boilerplate
- ✅ CLI packages with proper shebang injection

## 🔧 Extending the Configuration

You can extend the configuration for your specific needs:

### Adding Custom Options

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  external: ['vitest'],
  options: {
    minify: true,
    sourcemap: true,
    splitting: true,
    target: 'es2022',
  },
});
```

### Overriding Defaults

```typescript
// tsup.config.ts
import { createTsupConfig } from '@jmlweb/tsup-config-base';

export default createTsupConfig({
  format: ['esm'], // ESM only
  dts: false, // Disable type declarations
  outDir: 'build', // Custom output directory
});
```

### Externals Strategy

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

## 📝 Usage with Scripts

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
pnpm build    # Build the package
pnpm clean    # Clean build output
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **tsup** >= 8.0.0

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `tsup` (>=8.0.0)

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration for testing

### External Tools

- [tsup](https://tsup.egoist.dev/) - Bundle TypeScript libraries with zero config
- [esbuild](https://esbuild.github.io/) - Extremely fast JavaScript bundler (used by tsup)
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Rollup](https://rollupjs.org/) - Alternative bundler for complex configurations

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
