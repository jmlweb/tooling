# @jmlweb/tsconfig-astro

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-astro)](https://www.npmjs.com/package/@jmlweb/tsconfig-astro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-4%2B-FF5D01.svg)](https://astro.build/)

> TypeScript configuration for Astro projects. Extends `@jmlweb/tsconfig-base` with JSX support (preserve mode), DOM types, and bundler-optimized module resolution.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- ⚛️ **JSX Support**: JSX preserve mode for Astro's component system
- 🌐 **DOM Types**: Includes DOM and DOM.Iterable libs for browser APIs
- 📦 **Bundler Resolution**: Optimized `moduleResolution: "bundler"` for Astro's build system
- 🎯 **Modern Modules**: Uses ESNext modules for optimal bundling
- 🚀 **Extensible**: Extends base config, easy to customize

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsconfig-astro typescript astro @jmlweb/tsconfig-base
```

## 🚀 Quick Start

Create a `tsconfig.json` file in your Astro project root:

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### Basic Astro Setup

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### With Custom Output Directory

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### With Path Mapping

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### With Additional Compiler Options

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "outDir": "./dist",
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 📋 Configuration Details

### What's Included

This configuration extends `@jmlweb/tsconfig-base` and adds:

- ✅ **JSX Support**: `jsx: "preserve"` for Astro's component system (Astro handles JSX transformation)
- ✅ **DOM Types**: Includes `DOM` and `DOM.Iterable` libs
- ✅ **Bundler Resolution**: `moduleResolution: "bundler"` optimized for Astro's Vite-based build system
- ✅ **ESNext Modules**: `module: "ESNext"` for optimal bundling
- ✅ **All Base Config**: Inherits strict type checking and best practices

### JSX Preserve Mode

Uses `jsx: "preserve"` mode, which means:

- ✅ TypeScript preserves JSX syntax as-is
- ✅ Astro handles JSX transformation during build
- ✅ Works seamlessly with Astro components (`.astro` files)
- ✅ Supports JSX in `.tsx` files when using Astro's component islands

**Example:**

```typescript
// src/components/Counter.tsx
export function Counter() {
  return <button>Click me</button>;
}
```

### Module Resolution

Uses `bundler` resolution, which is optimized for:

- ✅ Astro's Vite-based build system
- ✅ Modern bundlers (Vite, esbuild, Rollup)
- ✅ Better tree-shaking and modern module features
- ✅ Optimal performance with Astro's build pipeline

## 🎯 When to Use

Use this configuration when you want:

- ✅ Astro project development
- ✅ TypeScript support in Astro components
- ✅ JSX support in Astro component islands
- ✅ Strict type checking for Astro code
- ✅ DOM API type support
- ✅ Modern bundler-optimized configuration

**For React projects**, use [`@jmlweb/tsconfig-react`](../tsconfig-react) instead.

**For Next.js projects**, use [`@jmlweb/tsconfig-nextjs`](../tsconfig-nextjs) instead.

**For non-React TypeScript projects**, use [`@jmlweb/tsconfig-base`](../tsconfig-base) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/layouts/*": ["./src/layouts/*"]
    },
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Astro-specific Options

Astro projects typically set `noEmit: true` since Astro handles the build process:

```json
{
  "extends": "@jmlweb/tsconfig-astro",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 📝 Usage with Scripts

TypeScript compilation is typically handled by Astro's build system. For type checking:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "astro build",
    "dev": "astro dev"
  }
}
```

### Usage with Astro

Astro automatically uses your `tsconfig.json` for type checking. Your Astro config doesn't need TypeScript-specific settings:

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Astro config...
});
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0
- **Astro** >= 4.0.0

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `typescript` (>= 5.0.0)
- `astro` (>= 4.0.0)
- `@jmlweb/tsconfig-base` (^1.0.1)

## 🔗 Related Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - Base TypeScript configuration (extended by this package)
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint configuration for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
