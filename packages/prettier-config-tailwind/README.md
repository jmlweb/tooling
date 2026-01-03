# @jmlweb/prettier-config-tailwind

[![npm version](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind)](https://www.npmjs.com/package/@jmlweb/prettier-config-tailwind)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

> Prettier configuration with Tailwind CSS class sorting. Extends `@jmlweb/prettier-config-base` with automatic Tailwind class organization.

## ✨ Features

- 🎨 **Tailwind Class Sorting**: Automatically sorts Tailwind CSS classes in the recommended order
- 🔧 **Base Config Included**: Inherits all settings from `@jmlweb/prettier-config-base`
- 🚀 **Zero Configuration**: Works out of the box with Tailwind projects
- 📦 **Plugin Integration**: Uses `prettier-plugin-tailwindcss` for optimal class ordering

## 📦 Installation

```bash
pnpm add -D @jmlweb/prettier-config-tailwind prettier prettier-plugin-tailwindcss
```

**Note**: The `prettier-plugin-tailwindcss` plugin must be installed as a dev dependency.

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

### Option 1: Using `package.json`

Add to your `package.json`:

```json
{
  "prettier": "@jmlweb/prettier-config-tailwind"
}
```

> ⚠️ **Note for ES Module projects**: If your project has `"type": "module"` in `package.json`, use [Option 2: `.prettierrc.mjs`](#option-2-using-prettierrcmjs-recommended-for-es-modules) instead to avoid configuration loading issues.

### Option 2: Using `.prettierrc.mjs` (Recommended for ES Modules)

Create a `.prettierrc.mjs` file in your project root:

```javascript
export { default } from '@jmlweb/prettier-config-tailwind';
```

> ✅ **Recommended for ES Module projects**: Use this option if your project has `"type": "module"` in `package.json` to ensure Prettier loads the configuration correctly.

### Option 3: Using `.prettierrc.js`

Create a `.prettierrc.js` file in your project root:

```javascript
module.exports = require('@jmlweb/prettier-config-tailwind');
```

## 💡 Examples

### Before Formatting

```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Click me
</button>
```

### After Formatting (Classes Automatically Sorted)

```jsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Click me
</button>
```

The plugin automatically sorts classes following Tailwind's recommended order:

1. Layout (display, position, etc.)
2. Flexbox & Grid
3. Spacing (padding, margin)
4. Sizing (width, height)
5. Typography
6. Backgrounds
7. Borders
8. Effects (shadows, etc.)
9. Transforms & Transitions
10. Interactivity (hover, focus, etc.)

## 📋 Configuration

This package extends `@jmlweb/prettier-config-base` and adds:

- ✅ All base configuration options:
  - Semicolons, single quotes, 2-space indentation
  - Trailing commas, LF line endings
  - And all other base settings
- ✅ `prettier-plugin-tailwindcss` - Automatically sorts Tailwind CSS classes

## 🤔 Why Use This?

> **Philosophy**: Tailwind class order should be consistent and automatic. Don't waste time manually organizing utility classes.

This package extends the base Prettier config with Tailwind-specific class sorting. Following Tailwind's recommended class order improves readability and makes it easier to scan markup quickly.

### Design Decisions

**Automatic Class Sorting**: Uses the official `prettier-plugin-tailwindcss`

- **Why**: Tailwind's recommended order groups related utilities together (layout → spacing → typography → visual effects), making classes easier to read and understand at a glance
- **Trade-off**: Initial formatting may reorder classes you've manually organized, but consistency across the codebase outweighs individual preferences
- **When to override**: If you have a strong reason to deviate from Tailwind's official recommendations (rare)

**Plugin Load Order**: The Tailwind plugin is loaded last in Prettier's plugin chain

- **Why**: Ensures Tailwind class sorting doesn't conflict with other Prettier plugins and runs after all other formatting
- **Trade-off**: None - this is the recommended approach by Tailwind Labs
- **When to override**: Never - this is a technical requirement, not a stylistic choice

**Extends Base Config**: Inherits all settings from `@jmlweb/prettier-config-base`

- **Why**: Maintains consistency with non-Tailwind projects while adding Tailwind-specific features
- **Trade-off**: If you need to change base formatting rules, you must override the base config settings
- **When to override**: When you need different base Prettier settings than the standard config

## 🎯 When to Use

Use this package when:

- ✅ You're using Tailwind CSS in your project
- ✅ You want consistent class ordering across your codebase
- ✅ You want to follow Tailwind's recommended class order
- ✅ You want automatic class sorting on save/format

**For projects without Tailwind**, use [`@jmlweb/prettier-config-base`](../prettier-config-base) instead.

## 🔧 Extending the Configuration

You can extend this config for project-specific needs:

```javascript
// .prettierrc.mjs (for ES modules)
import tailwindConfig from '@jmlweb/prettier-config-tailwind';

export default {
  ...tailwindConfig,
  // Override or add specific options
  printWidth: 100,
};
```

Or using CommonJS:

```javascript
// .prettierrc.js
const tailwindConfig = require('@jmlweb/prettier-config-tailwind');

module.exports = {
  ...tailwindConfig,
  // Override or add specific options
  printWidth: 100,
};
```

## 📝 Usage with Scripts

Add formatting scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\""
  }
}
```

Then run:

```bash
pnpm format        # Format all files
pnpm format:check  # Check formatting without modifying files
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Prettier** >= 3.0.0

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `prettier` (>= 3.0.0)
- `prettier-plugin-tailwindcss` (latest)

**Note**: The `prettier-plugin-tailwindcss` plugin must be installed. The plugin uses Tailwind's recommended class order and must be loaded last in Prettier's plugin chain (handled automatically).

## 📚 Examples

See real-world usage examples:

- [`example-react-typescript-app`](../../apps/example-react-typescript-app) - React TypeScript app with Tailwind CSS

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Base Prettier configuration (extended by this package)
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects

### External Tools

- [Prettier](https://prettier.io/) - Opinionated code formatter
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - Official Tailwind class sorting plugin

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### Warning: "Ignored unknown option" with ES Modules

**Symptoms:**

- Warning: `Ignored unknown option { default: { ... } }`
- Configuration not applied (Prettier uses default settings)
- Tailwind class sorting not working
- Project has `"type": "module"` in `package.json`

**Cause:**

- This package has `"type": "module"` and exports ES modules
- When Prettier loads config from the `"prettier"` field in `package.json`, it uses `require()` which receives the config wrapped in a `default` property
- Prettier expects the configuration object directly, not wrapped

**Solution:**

Use `.prettierrc.mjs` instead of the `"prettier"` field in `package.json`:

1. Create `.prettierrc.mjs` in your project root:

```javascript
export { default } from '@jmlweb/prettier-config-tailwind';
```

2. Remove the `"prettier"` field from your `package.json`

This allows Prettier to execute the ES module code correctly and load the configuration as expected.

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
