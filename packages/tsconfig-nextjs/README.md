# @jmlweb/tsconfig-nextjs

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-nextjs)](https://www.npmjs.com/package/@jmlweb/tsconfig-nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-000000.svg)](https://nextjs.org/)

> TypeScript configuration for Next.js apps (App Router and Pages Router). Extends `@jmlweb/tsconfig-react` with incremental builds, the Next.js plugin and an `@/*` alias.

## ✨ Features

- 🚀 **Next.js Plugin**: enhanced type checking for Next.js APIs
- ⚡ **Incremental Builds**: `incremental: true` for faster rebuilds
- 📁 **Path Alias**: `@/*` maps to the project root
- ⚛️ **React Ready**: inherits JSX, DOM types and bundler resolution
- 🔒 **Strict Mode**: inherits every strict flag from the base config

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsconfig-nextjs @jmlweb/tsconfig-react @jmlweb/tsconfig-base next typescript
```

## 🚀 Quick Start

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 💡 Examples

### Pages Router

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### `src/` directory with custom aliases

Overriding `paths` replaces the default `@/*` entry.

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📋 Configuration Details

Extends [`@jmlweb/tsconfig-react`](../tsconfig-react) (which extends [`@jmlweb/tsconfig-base`](../tsconfig-base)) and adds:

| Option        | Value                  | Description                          |
| ------------- | ---------------------- | ------------------------------------ |
| `incremental` | `true`                 | Reuse previous compilation info      |
| `plugins`     | `[{ "name": "next" }]` | Next.js TypeScript plugin            |
| `paths`       | `{ "@/*": ["./*"] }`   | `@/*` alias pointing to project root |

Inherited from the React config: `jsx: "react-jsx"`, `module: "ESNext"`, `moduleResolution: "bundler"`, `lib: ["ES2022", "DOM", "DOM.Iterable"]`.

`incremental` writes a `.tsbuildinfo` file; add it to `.gitignore`.

## 🎯 When to Use

- ✅ Next.js apps with the App Router or Pages Router
- ✅ Projects that want the `@/*` import convention

Plain React: use [`@jmlweb/tsconfig-react`](../tsconfig-react).

## 🔧 Extending the Configuration

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "noEmit": true,
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit"
  }
}
```

```bash
npm run typecheck
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **TypeScript** >= 5.0.0
- **Next.js** >= 13.0.0

## 📦 Peer Dependencies

- `@jmlweb/tsconfig-react` (^2.0.0), which itself requires `@jmlweb/tsconfig-base` (^2.0.0)
- `next` (>=13.0.0)
- `typescript` (>=5.0.0)

## 🔗 Related Packages

- [`@jmlweb/tsconfig-react`](../tsconfig-react) - config extended by this package
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - root of the extends chain
- [`@jmlweb/oxlint-config-react`](../oxlint-config-react) - Oxlint configuration for React (recommended)
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt configuration (recommended)

## 🔄 Migration Guide

### 1.x → 2.0.0

**Breaking:** Node.js `>=22.12.0` is now required (Node.js 18 and 20 are end-of-life).

1. Upgrade Node.js to 22.12.0 or later.
2. Update the package: `npm install --save-dev @jmlweb/tsconfig-nextjs@^2.0.0`.

The `compilerOptions` are unchanged. See the [Changelog](./CHANGELOG.md).

## 📄 License

MIT
