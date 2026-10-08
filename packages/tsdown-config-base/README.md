# @jmlweb/tsdown-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsdown-config-base)](https://www.npmjs.com/package/@jmlweb/tsdown-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.18.0-339933.svg)](https://nodejs.org/)
[![tsdown](https://img.shields.io/badge/tsdown-0.23.x-ff7e17.svg)](https://tsdown.dev/)

> Base tsdown configuration for jmlweb projects. The tsdown successor to [`@jmlweb/tsup-config-base`](../tsup-config-base), with the same helper API so a package can switch with minimal changes.

## ✨ Features

- 🎯 **Sensible Defaults**: Same defaults as `@jmlweb/tsup-config-base` (entry, formats, declarations, clean, `dist`)
- 📦 **Dual Format**: Generates CommonJS and ESM with `.d.ts` and `.d.cts` declarations
- 🔁 **Drop-in API**: `createTsdownConfig` and `createTsdownCliConfig` accept the same options as the tsup helpers
- 🧭 **Stable File Names**: Keeps tsup's `.js`/`.cjs` extensions so existing `exports` maps keep working
- ⚡ **Rolldown + Oxc**: Faster builds, and declaration generation without the TypeScript compiler API when you opt in
- 🖥️ **CLI Preset**: Shebang injection, including per-entry shebangs in a single config

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsdown-config-base tsdown typescript
```

> 💡 `typescript` is needed for declaration generation unless you enable `isolatedDeclarations`. See [Declaration Files and TypeScript 7](#declaration-files-and-typescript-7).

## 🚀 Quick Start

Create a `tsdown.config.ts` file in your project root:

```typescript
import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig();
```

## 💡 Examples

### With External Dependencies

```typescript
// tsdown.config.ts
import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  external: [
    // Internal packages
    '@jmlweb/eslint-config-base-js',
    // External peer dependencies
    '@eslint/js',
    'eslint',
  ],
});
```

### With Additional Options

```typescript
// tsdown.config.ts
import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  entry: { index: 'src/index.ts', utils: 'src/utils/index.ts' },
  external: ['vitest'],
  options: {
    minify: true,
    sourcemap: true,
  },
});
```

### CLI Package Configuration

```typescript
// tsdown.config.ts
import { createTsdownCliConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownCliConfig();
// Output: dist/cli.js with #!/usr/bin/env node shebang
```

### CLI with Library API

```typescript
// tsdown.config.ts
import { createTsdownCliConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownCliConfig({
  entry: {
    cli: 'src/cli.ts',
    index: 'src/index.ts',
  },
  shebang: 'cli', // Only add shebang to the cli entry
  external: ['commander'],
});
```

## 🤔 Why Use This?

> **Philosophy**: Keep the build contract of our packages (dual format, declarations, explicit externals) while moving off tsup, which is maintenance-only and recommends tsdown.

The defaults and design decisions are the same as [`@jmlweb/tsup-config-base`](../tsup-config-base). This package only adapts them to tsdown's option names and defaults, so the published output of a package does not change when it switches.

### Design Decisions

**Package-type file extensions (`fixedExtension: false`)**: Keep tsup's output names

- **Why**: tsdown defaults `fixedExtension` to `true` on the `node` platform, which emits `index.mjs`/`index.d.mts` instead of `index.js`/`index.d.ts`. Every `@jmlweb` package's `exports` map points to `.js`/`.cjs`/`.d.ts`/`.d.cts`, so the preset turns it off
- **Trade-off**: The extension of the ESM output depends on the `type` field in `package.json`, like tsup
- **When to override**: Pass `options: { fixedExtension: true }` if you prefer `.mjs`/`.cjs` and update your `exports` map accordingly

**Explicit externals (`external` → `deps.neverBundle`)**: Same option, new home

- **Why**: tsdown 0.23 deprecated `external` in favor of `deps.neverBundle` and throws if both are set. The preset keeps the `external` option and maps it, so callers do not need to know the new name
- **Trade-off**: `options.deps.neverBundle` is not accepted (it would conflict with `external`). Other `deps` options such as `alwaysBundle` and `onlyBundle` pass through
- **When to override**: Rarely. Like tsup, tsdown already externalizes `dependencies`, `peerDependencies` and `optionalDependencies` from `package.json`; `external` covers anything else

## 📋 Configuration Details

### Default Settings

| Setting          | Default Value      | Description                                      |
| ---------------- | ------------------ | ------------------------------------------------ |
| `entry`          | `['src/index.ts']` | Entry point(s) for the build                     |
| `format`         | `['cjs', 'esm']`   | Output formats (dual publishing)                 |
| `dts`            | `true`             | Generate TypeScript declarations                 |
| `clean`          | `true`             | Clean output directory before build              |
| `outDir`         | `'dist'`           | Output directory                                 |
| `fixedExtension` | `false`            | Use `.js`/`.cjs` based on `package.json` type    |
| `external`       | `[]`               | Packages to exclude (sent to `deps.neverBundle`) |

### API Reference

#### `createTsdownConfig(options?: TsdownConfigOptions): UserConfig`

| Option     | Type                                    | Default            | Description                                    |
| ---------- | --------------------------------------- | ------------------ | ---------------------------------------------- |
| `entry`    | `string[] \| Record<string, string>`    | `['src/index.ts']` | Entry point files                              |
| `format`   | `('cjs' \| 'esm' \| 'iife' \| 'umd')[]` | `['cjs', 'esm']`   | Output formats                                 |
| `dts`      | `boolean \| DtsOptions`                 | `true`             | Generate declaration files (or tsdown options) |
| `clean`    | `boolean`                               | `true`             | Clean output before build                      |
| `outDir`   | `string`                                | `'dist'`           | Output directory                               |
| `external` | `(string \| RegExp)[]`                  | `[]`               | Packages to exclude from bundle                |
| `options`  | `AdditionalOptions`                     | `{}`               | Additional tsdown options, merged last         |

#### `createTsdownCliConfig(options?: TsdownCliConfigOptions): UserConfig`

Accepts the options above (with `format` defaulting to `['esm']` and `entry` to `{ cli: 'src/cli.ts' }`) plus:

| Option    | Type                            | Default    | Description                                                      |
| --------- | ------------------------------- | ---------- | ---------------------------------------------------------------- |
| `target`  | `NodeTarget`                    | `'node18'` | Node.js target version                                           |
| `shebang` | `boolean \| string \| string[]` | `true`     | Add shebang to all entries (`true`) or to the named entries only |

Entry names for `shebang` are the output names tsdown emits without extension (for example `cli` for `dist/cli.js`).

#### Exports

- `BASE_DEFAULTS`, `CLI_DEFAULTS` - Default configuration values
- `EntryConfig`, `NodeTarget`, `OutputFormat`, `DepsOptions` - Helper types
- `TsdownConfigOptions`, `TsdownCliConfigOptions` - Options for the helpers
- `AdditionalOptions`, `AdditionalCliOptions` - Types of the `options` field
- `UserConfig` - Re-exported from tsdown, also exported as `Options` to match `@jmlweb/tsup-config-base`

### Differences from `@jmlweb/tsup-config-base`

| Area                  | tsup-config-base                                      | tsdown-config-base                                                                          |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Helper names          | `createTsupConfig`, `createTsupCliConfig`             | `createTsdownConfig`, `createTsdownCliConfig`                                               |
| Config file           | `tsup.config.ts`                                      | `tsdown.config.ts`                                                                          |
| Return type           | `Options` (`Options \| Options[]` for the CLI preset) | Always a single `UserConfig`                                                                |
| `external`            | Passed to tsup's `external`                           | Mapped to `deps.neverBundle` (`external` is deprecated in tsdown 0.23)                      |
| File extensions       | Based on `package.json` type                          | Same, by setting `fixedExtension: false` (tsdown's node default is `true`)                  |
| Selective shebang     | Split into several configs                            | One config with a per-file `banner` function                                                |
| `format`              | `cjs`, `esm`, `iife`                                  | Adds `umd`                                                                                  |
| `splitting`, `bundle` | Available in `options`                                | Not available: code splitting is always on; use `unbundle: true` instead of `bundle: false` |
| `noExternal`          | Available in `options`                                | Use `options.deps.alwaysBundle`                                                             |
| Declarations          | rollup-plugin-dts on the TypeScript compiler API      | tsc, tsgo or Oxc, see below                                                                 |
| Node.js               | >= 18.0.0                                             | `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` (tsdown's own requirement)                           |

When a package targets a Node.js version that supports `require(esm)` (for example through `engines.node`), tsdown logs `We recommend using the ESM format instead of CommonJS.` for the default dual output. The build still succeeds; pass `options: { checks: { legacyCjs: false } }` to silence it, or `format: ['esm']` to drop CommonJS.

### Declaration Files and TypeScript 7

tsdown picks the declaration generator automatically. Verified with tsdown 0.23.0:

| Project setup                                   | Generator | Needs the TypeScript compiler API?                        |
| ----------------------------------------------- | --------- | --------------------------------------------------------- |
| `typescript` 5.x / 6.x installed                | `tsc`     | Yes                                                       |
| `typescript` 7.x installed                      | `tsgo`    | No: runs the native `tsc` binary (experimental in tsdown) |
| `isolatedDeclarations: true` in `tsconfig.json` | `oxc`     | No: works even without `typescript` installed             |
| No `typescript` and no `isolatedDeclarations`   | -         | Build fails: `TypeScript is not installed`                |

So `.d.ts`/`.d.cts` generation works without the TypeScript compiler API in two ways: with TypeScript 7 (through tsgo), or with `isolatedDeclarations` (through Oxc, which requires explicit types on exported declarations). To force a generator, pass `dts: { generator: 'oxc' }` (or `'tsc'` / `'tsgo'`).

## 🎯 When to Use

Use this configuration when you want:

- ✅ To build a TypeScript library with tsdown instead of tsup
- ✅ Dual-format output (CommonJS + ESM) with declarations for both
- ✅ To migrate from `@jmlweb/tsup-config-base` without changing published file names
- ✅ Declaration generation that is ready for TypeScript 7
- ✅ CLI packages with shebang injection

**To stay on tsup**, [`@jmlweb/tsup-config-base`](../tsup-config-base) still works but is deprecated and no longer maintained.

## 🔧 Extending the Configuration

### Overriding Defaults

```typescript
// tsdown.config.ts
import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  format: ['esm'], // ESM only
  outDir: 'build',
  options: {
    fixedExtension: true, // Emit .mjs/.d.mts
    unbundle: true, // Mirror the src/ structure instead of bundling
  },
});
```

### Bundling a Specific Dependency

```typescript
// tsdown.config.ts
import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  external: ['eslint'],
  options: {
    deps: { alwaysBundle: ['tiny-utils'] },
  },
});
```

## 📝 Usage with Scripts

Add build scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "tsdown",
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

- **Node.js** ^22.18.0, ^24.11.0 or >= 26.0.0
- **tsdown** ~0.23.0
- **TypeScript** 5.x, 6.x or 7.x (optional with `isolatedDeclarations`)

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `tsdown` (~0.23.0)

**Note**: tsdown is pre-1.0 and ships breaking changes in minor releases, so the range only allows patch updates. It will be widened as tsdown releases are verified.

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/tsup-config-base`](../tsup-config-base) - Deprecated tsup equivalent of this package
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects
- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration for testing

### External Tools

- [tsdown](https://tsdown.dev/) - The elegant library bundler, powered by Rolldown
- [Rolldown](https://rolldown.rs/) - Rust bundler used by tsdown
- [Oxc](https://oxc.rs/) - Used for fast declaration generation with `isolatedDeclarations`

## 🔄 Migration Guide

### From `@jmlweb/tsup-config-base`

1. Install the new packages: `pnpm add -D @jmlweb/tsdown-config-base tsdown` and remove `@jmlweb/tsup-config-base` and `tsup`
2. Rename `tsup.config.ts` to `tsdown.config.ts`
3. Change the import and helper name:

   ```typescript
   // Before
   import { createTsupConfig } from '@jmlweb/tsup-config-base';
   export default createTsupConfig({ external: ['eslint'] });

   // After
   import { createTsdownConfig } from '@jmlweb/tsdown-config-base';
   export default createTsdownConfig({ external: ['eslint'] });
   ```

4. Change the `build` script from `tsup` to `tsdown`
5. Move tsup-only `options` (`splitting`, `bundle`, `noExternal`, `esbuildPlugins`, ...) to their tsdown equivalents (see [Differences](#differences-from-jmlwebtsup-config-base))
6. Build and compare `dist/` with the previous output

For version history, see the [Changelog](./CHANGELOG.md).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
