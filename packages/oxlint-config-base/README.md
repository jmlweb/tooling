# @jmlweb/oxlint-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/oxlint-config-base)](https://www.npmjs.com/package/@jmlweb/oxlint-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)

> Base [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for JavaScript and TypeScript projects. Ports the rules of [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js) and [`@jmlweb/eslint-config-base`](../eslint-config-base) to a linter that runs in milliseconds.

## ✨ Features

- ⚡ **Fast**: Oxlint is written in Rust; type-aware rules run on the Go port of TypeScript
- 🔒 **Strict TypeScript**: typescript-eslint's `recommended`, `strict-type-checked` and `stylistic-type-checked` rules
- 🟨 **JavaScript and TypeScript in one config**: ESLint `recommended` rules for every file, TypeScript rules for `.ts`/`.tsx`/`.mts`/`.cts`
- 🎯 **Same conventions**: `type` over `interface`, no enums, no `any`, named exports only, no parameter mutation

## 📦 Installation

```bash
pnpm add -D @jmlweb/oxlint-config-base oxlint oxlint-tsgolint
```

> `oxlint-tsgolint` is only needed for type-aware rules. Leave it out to lint without type information.

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create an `oxlint.config.ts` file in your project root:

```typescript
import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true,
  },
});
```

> ⚠️ **`typeAware` must be set in your own config**: Oxlint only reads `options` from the root config file, not from configs loaded through `extends`. Without it, the type-aware rules are skipped silently.

## 💡 Examples

### Before

```typescript
enum Status {
  Active,
}

interface User {
  name: string;
}

export default function rename(user: User, data: any) {
  user.name = data.name;
  save(user);
}
```

### Errors Reported

```text
src/user.ts:1:1: error jmlweb(no-enum): Use const maps instead of enums
src/user.ts:1:6: error eslint(no-unused-vars): Enum 'Status' is declared but never used.
src/user.ts:5:1: error typescript(consistent-type-definitions): Use `type` instead of `interface`.
src/user.ts:9:8: error import(no-default-export): Prefer named exports
src/user.ts:9:50: error typescript(no-explicit-any): Unexpected `any`. Specify a different type.
src/user.ts:10:3: error eslint(no-param-reassign): Assignment to property of function parameter 'user'.
src/user.ts:10:15: error typescript(no-unsafe-assignment): Unsafe assignment of an any value.
src/user.ts:10:20: error typescript(no-unsafe-member-access): Unsafe member access .name on an `any` value.
src/user.ts:11:3: error typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
```

### After

```typescript
const STATUS = { ACTIVE: 'active' } as const;

type User = {
  name: string;
};

export const rename = async (user: User, name: string): Promise<User> => {
  const renamed = { ...user, name };
  await save(renamed);
  return renamed;
};
```

## 📋 Configuration Details

### All Files

- Oxlint's `correctness` category as `error`
- Oxlint equivalents of ESLint's `recommended` rules

### TypeScript Files

Applied to `**/*.{ts,tsx,mts,cts}`:

- typescript-eslint `recommended`, `strict` and `stylistic` rules
- typescript-eslint `strict-type-checked` and `stylistic-type-checked` rules (with `options.typeAware`)
- Core rules the TypeScript compiler already checks (such as `no-undef`) turned off

### Key Rules Enforced

| Rule                                     | Level   | Description                                   |
| ---------------------------------------- | ------- | --------------------------------------------- |
| `typescript/no-explicit-any`             | `error` | Prevents `any` type usage                     |
| `typescript/consistent-type-imports`     | `error` | Enforces inline `type` imports                |
| `typescript/consistent-type-definitions` | `error` | Prefers `type` over `interface`               |
| `jmlweb/no-enum`                         | `error` | Prevents enum usage (prefer const maps)       |
| `import/no-default-export`               | `error` | Prevents default exports (named exports only) |
| `eslint/no-param-reassign`               | `error` | Prevents mutating parameters and their props  |
| `eslint/no-unused-vars`                  | `error` | Allows unused names prefixed with `_`         |

Files matching `**/*.config.{ts,mts,cts}` may use default exports, since tools like Vite and Oxlint require them.

### Differences from `@jmlweb/eslint-config-base`

- **No naming convention rule**: `@typescript-eslint/naming-convention` needs typescript-eslint's parser and cannot run in Oxlint
- **No import sorting rule**: [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) sorts imports instead (see [Import Sorting](#-import-sorting))
- **No Prettier conflict rules**: Not needed, this config enables no formatting rules
- **No `no-unsafe-enum-assignment`**: Not available in Oxlint, and enums are banned anyway

## 🔄 Import Sorting

This config has no import sorting rule: [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) sorts imports when formatting, with the same order as `eslint-plugin-perfectionist`'s `sort-imports` defaults. Run `oxfmt` (or `oxfmt --check` in CI) alongside `oxlint`.

To keep `eslint-plugin-simple-import-sort`'s order instead, turn off `sortImports` in your Oxfmt config and run the ESLint plugin through Oxlint:

```typescript
// oxlint.config.ts
import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: ['eslint-plugin-simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
});
```

## 🤔 Why Use This?

> **Philosophy**: Keep the strict rules of the ESLint config, drop the wait.

This package brings the decisions of [`@jmlweb/eslint-config-base`](../eslint-config-base#-why-use-this) to Oxlint. The rule list is generated from typescript-eslint's presets, so the strictness matches; only the rules Oxlint cannot run are left out (see [Differences](#differences-from-jmlwebeslint-config-base)).

### Design Decisions

**One package for JavaScript and TypeScript**: TypeScript rules apply through a file override

- **Why**: Oxlint parses both languages natively, so a separate JavaScript-only package adds nothing
- **Trade-off**: None for JavaScript projects; TypeScript rules never match `.js` files
- **When to override**: Not needed

**Enum ban as a bundled JS plugin (`jmlweb/no-enum`)**: Oxlint has no `no-restricted-syntax`

- **Why**: Keeps the const-map convention without extra dependencies
- **Trade-off**: Runs through Oxlint's JS plugin support, which is still in alpha
- **When to override**: Set `'jmlweb/no-enum': 'off'` if your project uses enums

## 🎯 When to Use

Use this package when you want:

- ✅ Fast linting for new JavaScript or TypeScript projects (recommended over ESLint)
- ✅ To migrate from `@jmlweb/eslint-config-base` or `@jmlweb/eslint-config-base-js`
- ✅ Type-aware rules without typescript-eslint's runtime cost

**For React projects**, use [`@jmlweb/oxlint-config-react`](../oxlint-config-react). **For Node.js or Astro projects**, keep using [`@jmlweb/eslint-config-node`](../eslint-config-node) or [`@jmlweb/eslint-config-astro`](../eslint-config-astro) until their Oxlint versions exist.

## 🔧 Extending the Configuration

```typescript
import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['generated/**'],
  rules: {
    'jmlweb/no-enum': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        'typescript/no-non-null-assertion': 'off',
      },
    },
  ],
});
```

## 📝 Usage with Scripts

Add linting scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

Then run:

```bash
pnpm lint      # Lint all files
pnpm lint:fix  # Fix auto-fixable problems
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Oxlint** >= 1.87.0
- **TypeScript project** with a `tsconfig.json` (for type-aware rules)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `oxlint` (>= 1.87.0)
- `oxlint-tsgolint` (>= 7.0.0, optional, enables type-aware rules)

## 📚 Examples

See real-world usage examples:

- [`jmlweb-tooling`](../..) - This monorepo lints its JavaScript files with this package

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/oxlint-config-react`](../oxlint-config-react) - Extends this config for React projects
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt config, the formatter to pair with this linter
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint equivalent of this configuration
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript config for type-aware linting

### External Tools

- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) - Linter written in Rust
- [Type-Aware Linting](https://oxc.rs/docs/guide/usage/linter/type-aware) - How Oxlint runs type-aware rules
- [Migrate from ESLint](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html) - Official migration guide

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### Type-Aware Rules Not Reporting

**Symptoms:**

- Unawaited promises or unsafe `any` usage are not reported

**Cause:**

- `options.typeAware` is missing from your `oxlint.config.ts`, or `oxlint-tsgolint` is not installed

**Solution:**

Set `options: { typeAware: true }` in your own config (see [Quick Start](#-quick-start)) and install `oxlint-tsgolint`.

### "Relative JS plugin specifiers are not supported"

**Symptoms:**

- Oxlint fails to load a shared config that lists `./my-plugin.js` in `jsPlugins`

**Cause:**

- Oxlint only accepts package names or absolute paths in configs loaded through `extends`

**Solution:**

Reference JS plugins by package name, as this package does with `@jmlweb/oxlint-config-base/plugin`.

## 🔄 Migration Guide

### Migrating from `@jmlweb/eslint-config-base`

1. Install this package, `oxlint` and `oxlint-tsgolint`
2. Create `oxlint.config.ts` as shown in [Quick Start](#-quick-start)
3. Format with [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base), which sorts imports (see [Import Sorting](#-import-sorting))
4. Replace `eslint` with `oxlint` in your scripts and `lint-staged` config
5. Remove `eslint.config.*` and the ESLint packages
6. Run `pnpm lint` and fix the reported problems

[`@oxlint/migrate`](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html) can convert custom rules from an existing ESLint config.

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

**No breaking changes have been introduced yet.** This package follows semantic versioning. When breaking changes are introduced, detailed migration instructions will be provided here.

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
