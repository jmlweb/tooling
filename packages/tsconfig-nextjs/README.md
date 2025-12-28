# @jmlweb/tsconfig-nextjs

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-nextjs)](https://www.npmjs.com/package/@jmlweb/tsconfig-nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-000000.svg)](https://nextjs.org/)

> TypeScript configuration for Next.js applications. Extends `@jmlweb/tsconfig-react` with Next.js-specific optimizations, incremental builds, and path aliases.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base configs
- ⚛️ **React Support**: Full JSX support with modern React transform
- 🚀 **Next.js Optimized**: Incremental builds and Next.js TypeScript plugin
- 📁 **Path Aliases**: Pre-configured `@/*` path alias for clean imports
- 🎯 **App Router Ready**: Optimized for Next.js App Router and Pages Router
- 🌐 **DOM Types**: Includes DOM and DOM.Iterable libs for browser APIs
- 📦 **Bundler Resolution**: Optimized `moduleResolution: "bundler"` for Next.js

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsconfig-nextjs typescript next @jmlweb/tsconfig-react @jmlweb/tsconfig-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create a `tsconfig.json` file in your Next.js project root:

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 💡 Examples

### Basic Next.js Setup (App Router)

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js with Custom Path Aliases

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js Pages Router

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Next.js with Additional Compiler Options

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📋 Configuration Details

### What's Included

This configuration extends `@jmlweb/tsconfig-react` and adds:

- ✅ **Incremental Builds**: `incremental: true` for faster compilation
- ✅ **Next.js Plugin**: TypeScript plugin for Next.js-specific type checking
- ✅ **Path Aliases**: Default `@/*` alias pointing to project root
- ✅ **All React Config**: Inherits JSX support, DOM types, and bundler resolution
- ✅ **All Base Config**: Inherits strict type checking and best practices

### Next.js TypeScript Plugin

The Next.js TypeScript plugin provides:

- ✅ Enhanced type checking for Next.js APIs
- ✅ Better autocomplete for Next.js components
- ✅ Type safety for App Router and Pages Router
- ✅ Support for Next.js-specific features

### Incremental Builds

Incremental compilation:

- ✅ Faster subsequent builds
- ✅ Only recompiles changed files
- ✅ Stores build information in `.tsbuildinfo` file
- ✅ Recommended by Next.js for better performance

### Path Aliases

Default path alias configuration:

```typescript
// Instead of:
import { Button } from '../../../components/Button';

// You can use:
import { Button } from '@/components/Button';
```

The `@/*` alias is pre-configured to point to your project root. You can customize it in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Note**: Make sure to also configure the same alias in your `next.config.js`:

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};
```

Or use the built-in Next.js path mapping:

```javascript
// next.config.js
module.exports = {
  // Next.js 13+ automatically resolves tsconfig paths
};
```

## 🎯 When to Use

Use this configuration when you want:

- ✅ Next.js application development (App Router or Pages Router)
- ✅ Strict type checking for Next.js code
- ✅ Incremental builds for faster development
- ✅ Next.js TypeScript plugin support
- ✅ Path aliases for cleaner imports
- ✅ Modern React JSX transform
- ✅ DOM API type support

**For React projects without Next.js**, use [`@jmlweb/tsconfig-react`](../tsconfig-react) instead.

**For non-React TypeScript projects**, use [`@jmlweb/tsconfig-base`](../tsconfig-base) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    },
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Disabling Next.js Plugin

If you need to disable the Next.js plugin:

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "plugins": []
  }
}
```

### Customizing Path Aliases

Override the default path alias:

```json
{
  "extends": "@jmlweb/tsconfig-nextjs",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

## 📝 Usage with Scripts

Next.js handles TypeScript compilation automatically. You typically don't need to run `tsc` manually, but you can add type checking scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit"
  }
}
```

### Next.js Type Checking

Next.js includes built-in type checking:

- ✅ Type errors shown during `next build`
- ✅ Type errors shown in development mode
- ✅ IDE integration with TypeScript language server

### VS Code Integration

For the best experience in VS Code:

1. Install the TypeScript extension
2. Open Command Palette (`Ctrl/⌘ + Shift + P`)
3. Select "TypeScript: Select TypeScript Version"
4. Choose "Use Workspace Version"

This ensures VS Code uses the Next.js TypeScript plugin for enhanced type checking.

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0
- **Next.js** >= 13.0.0 (for App Router support)
- **React** >= 17.0.0 (for JSX runtime support)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `typescript` (>= 5.0.0)
- `next` (>= 13.0.0)
- `@jmlweb/tsconfig-react` (^1.0.0)

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript configuration for React (extended by this package)
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - Base TypeScript configuration
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint configuration for React/Next.js projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

### External Tools

- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
- [Next.js](https://nextjs.org/) - The React framework for production
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [Turbopack](https://turbo.build/pack) - Incremental bundler optimized for JavaScript and TypeScript

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
