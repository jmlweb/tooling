# @jmlweb/tsconfig-astro

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-astro)](https://www.npmjs.com/package/@jmlweb/tsconfig-astro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-4%2B-FF5D01.svg)](https://astro.build/)

> TypeScript configuration for Astro projects with JSX preserve mode and bundler resolution. Extends `@jmlweb/tsconfig-base`.

## ✨ Features

- 🚀 **Astro Ready**: `jsx: "preserve"` for Astro and framework components
- 🌐 **DOM Types**: `DOM` and `DOM.Iterable` libs
- 📦 **Bundler Resolution**: `module: "ESNext"` with `moduleResolution: "bundler"`
- 🔒 **Strict Mode**: inherits every strict flag from the base config

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsconfig-astro @jmlweb/tsconfig-base astro typescript
```

## 🚀 Quick Start

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "include": ["src", ".astro/types.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### Path aliases

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", ".astro/types.d.ts"]
}
```

### React islands

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src", ".astro/types.d.ts"]
}
```

## 📋 Configuration Details

Extends [`@jmlweb/tsconfig-base`](../tsconfig-base) and overrides:

| Option             | Value                               | Description                          |
| ------------------ | ----------------------------------- | ------------------------------------ |
| `jsx`              | `preserve`                          | Leave JSX to Astro and its renderers |
| `module`           | `ESNext`                            | ES modules for bundlers              |
| `moduleResolution` | `bundler`                           | Bundler-style resolution             |
| `lib`              | `["ES2022", "DOM", "DOM.Iterable"]` | ES2022 plus browser APIs             |

Everything else (`strict`, `target: ES2022`, `verbatimModuleSyntax`, …) comes from the base config.

## 🎯 When to Use

- ✅ Astro sites and content-driven projects
- ✅ Astro with React, Preact or Solid islands

Use [`@jmlweb/tsconfig-react`](../tsconfig-react) for React-only apps and [`@jmlweb/tsconfig-node`](../tsconfig-node) for Node.js code.

## 🔧 Extending the Configuration

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "noEmit": true,
    "types": ["astro/client"]
  }
}
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "typecheck": "astro check"
  }
}
```

```bash
npm run typecheck
```

`astro check` requires `@astrojs/check`.

## 📋 Requirements

- **Node.js** >= 22.12.0
- **TypeScript** >= 5.0.0
- **Astro** >= 4.0.0

## 📦 Peer Dependencies

- `@jmlweb/tsconfig-base` (^2.0.0)
- `astro` (>=4.0.0)
- `typescript` (>=5.0.0)

## 🔗 Related Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - base config extended by this package
- [`@jmlweb/eslint-config-astro`](../eslint-config-astro) - ESLint configuration for Astro
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt configuration (recommended)

## 🔄 Migration Guide

### 1.x → 2.0.0

**Breaking:** Node.js `>=22.12.0` is now required (Node.js 18 and 20 are end-of-life).

1. Upgrade Node.js to 22.12.0 or later.
2. Update the package: `npm install --save-dev @jmlweb/tsconfig-astro@^2.0.0`.

The `compilerOptions` are unchanged. See the [Changelog](./CHANGELOG.md).

## 📄 License

MIT
