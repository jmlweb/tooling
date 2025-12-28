# @jmlweb/tsconfig-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-base)](https://www.npmjs.com/package/@jmlweb/tsconfig-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> Base TypeScript configuration with strict type checking and modern defaults. Designed to be extended by projects without imposing file inclusion/exclusion patterns.

## ✨ Features

- 🔒 **Strict Mode**: All strict flags enabled for maximum type safety
- 🚀 **Modern Defaults**: ES2022 target with NodeNext module resolution
- 🛡️ **Extra Safety**: Additional strict checks beyond the `strict` flag
- 🎯 **Flexible**: No `include`/`exclude` defined - you control what gets compiled
- 🗺️ **Source Maps**: Enabled by default for debugging

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsconfig-base typescript
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create a `tsconfig.json` file in your project root:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### Node.js Project

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Library with Multiple Entry Points

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Monorepo Package

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### React Project

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Overriding Options

You can override any option in your project's `tsconfig.json`:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "target": "ES2020",
    "noUncheckedIndexedAccess": false
  },
  "include": ["src/**/*"]
}
```

## 📋 Configuration Details

### Compiler Options Included

| Option                               | Value      | Description                                    |
| ------------------------------------ | ---------- | ---------------------------------------------- |
| `strict`                             | `true`     | Enables all strict type checking options       |
| `target`                             | `ES2022`   | Modern JavaScript features                     |
| `module`                             | `NodeNext` | Node.js ESM module system                      |
| `moduleResolution`                   | `NodeNext` | Node.js module resolution                      |
| `esModuleInterop`                    | `true`     | CommonJS/ESM interoperability                  |
| `skipLibCheck`                       | `true`     | Skip type checking of declaration files        |
| `forceConsistentCasingInFileNames`   | `true`     | Enforce consistent file name casing            |
| `declaration`                        | `true`     | Generate `.d.ts` files                         |
| `declarationMap`                     | `true`     | Generate sourcemaps for `.d.ts` files          |
| `sourceMap`                          | `true`     | Generate sourcemaps for debugging              |
| `noUncheckedIndexedAccess`           | `true`     | Add `undefined` to index signatures            |
| `noImplicitOverride`                 | `true`     | Require `override` keyword                     |
| `noPropertyAccessFromIndexSignature` | `true`     | Require bracket notation for index signatures  |
| `exactOptionalPropertyTypes`         | `true`     | Differentiate between `undefined` and optional |
| `noFallthroughCasesInSwitch`         | `true`     | Report fallthrough cases in switch             |
| `isolatedModules`                    | `true`     | Ensure compatibility with transpilers          |
| `verbatimModuleSyntax`               | `true`     | Enforce explicit type imports/exports          |
| `resolveJsonModule`                  | `true`     | Allow importing JSON files                     |

### What You Need to Configure

Since this base config intentionally omits file patterns, you must configure:

- ✅ `include`: Which files to compile (e.g., `["src/**/*"]`)
- ✅ `exclude`: Which files to ignore (e.g., `["node_modules", "dist"]`)
- ✅ `outDir`: Output directory for compiled files
- ✅ `rootDir`: Root directory of source files (optional but recommended)

## 🎯 Why No File Patterns?

This base config intentionally omits `include` and `exclude` patterns because:

- ✅ Different projects have different file structures
- ✅ You maintain full control over what gets compiled
- ✅ Prevents conflicts with project-specific patterns
- ✅ More flexible for various project types

## 🤔 Why Use This?

> **Philosophy**: TypeScript should catch bugs at compile time through strict type checking. If it compiles without errors, it should work correctly.

This package provides an opinionated TypeScript configuration that enables all strict flags and additional safety checks. It's designed to prevent common JavaScript pitfalls through TypeScript's type system while remaining flexible enough for any project type.

### Design Decisions

**All Strict Flags Enabled (`strict: true` + extras)**: Enables strict null checks, no implicit any, strict function types, etc.

- **Why**: TypeScript's strict mode catches entire classes of bugs (null/undefined errors, implicit any holes, binding issues). Additional flags like `noUncheckedIndexedAccess` catch even more edge cases
- **Trade-off**: More initial type errors when adopting, requires explicit null handling. But this prevents runtime crashes
- **When to override**: For gradual migration from JavaScript (but aim to enable all flags eventually)

**Modern Target (ES2022)**: Compiles to ES2022 with modern JavaScript features

- **Why**: Modern Node.js and browsers support ES2022. Using modern features provides better performance and cleaner output. Let your runtime handle the code
- **Trade-off**: Requires Node.js 18+ or modern browsers. If targeting older environments, override with `ES2020` or lower
- **When to override**: When supporting legacy environments (but consider transpiling separately)

**NodeNext Module Resolution**: Uses Node.js ESM resolution algorithm

- **Why**: Matches how Node.js resolves modules in real projects. Prevents module resolution mismatches between TypeScript and runtime
- **Trade-off**: Requires proper package.json exports and file extensions in imports. But this matches modern JavaScript standards
- **When to override**: For legacy projects using CommonJS exclusively (but you should migrate to ESM)

**No File Inclusion**: Doesn't specify `include` or `exclude` patterns

- **Why**: Different projects have different structures (src/, lib/, packages/). Config shouldn't impose opinions about project layout
- **Trade-off**: Must define your own `include`/`exclude` in project tsconfig.json (but you'd do this anyway for custom needs)
- **When to override**: Never - add include/exclude in your project's tsconfig.json

**Source Maps Enabled**: Generates source maps for debugging

- **Why**: Source maps enable debugging TypeScript source in Node.js and browsers. Essential for production debugging
- **Trade-off**: Slightly larger build output, but negligible compared to debugging benefits
- **When to override**: If you're absolutely certain you don't need debugging (rare)

## 🎯 When to Use

Use this configuration when you want:

- ✅ Strict TypeScript type checking for maximum type safety
- ✅ Modern JavaScript features (ES2022)
- ✅ Node.js ESM module system
- ✅ Flexible file inclusion/exclusion patterns
- ✅ Foundation for extending with framework-specific configs

**For React projects**, use [`@jmlweb/tsconfig-react`](../tsconfig-react) instead.

**For internal tooling projects**, use [`@jmlweb/tsconfig-internal`](../tsconfig-internal) instead.

## 🔧 Extending the Configuration

### Using ES Modules (ESM)

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Using CommonJS

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

### Less Strict Configuration

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false
  }
}
```

## 📝 Usage with Scripts

TypeScript compilation is typically handled by your build tool or IDE. For manual compilation:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `typescript` (>= 5.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint configuration for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier configuration
- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript configuration for React projects

### External Tools

- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
- [ts-node](https://typestrong.org/ts-node/) - TypeScript execution engine for Node.js
- [tsx](https://github.com/privatenumber/tsx) - Fast TypeScript/ESM execution (alternative to ts-node)
- [ESLint](https://eslint.org/) - Linter for TypeScript (use with @jmlweb/eslint-config-base)

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### Missing File Extensions Error

**Symptoms:**

- Error: "Relative import paths need explicit file extensions in ECMAScript imports"
- Import statements like `import { foo } from './bar'` fail

**Cause:**

- This config uses `moduleResolution: "NodeNext"` which follows Node.js ESM rules
- Node.js requires explicit `.js` extensions in import statements (even for `.ts` files)

**Solution:**

Add `.js` extensions to your imports (TypeScript will resolve to `.ts` files):

```typescript
// Before
import { foo } from './bar';

// After
import { foo } from './bar.js';
```

Or switch to a bundler-based module resolution:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Module and ModuleResolution Mismatch

**Symptoms:**

- Error: "Option 'module' must be set to 'NodeNext' when 'moduleResolution' is 'NodeNext'"
- Type errors related to module resolution

**Cause:**

- Both `module` and `moduleResolution` must be set to compatible values
- This config uses `NodeNext` for both

**Solution:**

If you need to override the module system, update both options together:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### CommonJS vs ESM Mismatch

**Symptoms:**

- Code runs but module resolution is incorrect
- `require` statements in output when you expected `import`

**Cause:**

- Your `package.json` has `"type": "module"` but your build uses CommonJS
- Or vice versa

**Solution:**

Match your `package.json` to your build output:

```json
// package.json
{
  "type": "module" // For ESM output (this config's default)
}
```

Or override to CommonJS:

```json
// tsconfig.json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

### Index Signature Type Errors

**Symptoms:**

- Error: "Object is possibly 'undefined'" when accessing object properties
- Example: `obj[key]` shows type `T | undefined`

**Cause:**

- This config enables `noUncheckedIndexedAccess` for extra safety
- TypeScript correctly adds `undefined` to index access types

**Solution:**

Use optional chaining or explicit checks:

```typescript
// Before
const value = obj[key].toString();

// After - option 1: optional chaining
const value = obj[key]?.toString();

// After - option 2: explicit check
if (obj[key] !== undefined) {
  const value = obj[key].toString();
}

// After - option 3: type assertion (use sparingly)
const value = obj[key]!.toString();
```

Or disable this strict check:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "noUncheckedIndexedAccess": false
  }
}
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
