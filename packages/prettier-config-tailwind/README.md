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
npm install --save-dev @jmlweb/prettier-config-tailwind prettier prettier-plugin-tailwindcss
```

**Note**: The `prettier-plugin-tailwindcss` plugin must be installed as a dev dependency.

## 🚀 Quick Start

### Option 1: Using `package.json` (Recommended)

Add to your `package.json`:

```json
{
  "prettier": "@jmlweb/prettier-config-tailwind"
}
```

### Option 2: Using `.prettierrc.js`

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

## 🔧 Usage with Scripts

Add formatting scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\""
  }
}
```

## 🎯 When to Use

Use this package when:

- ✅ You're using Tailwind CSS in your project
- ✅ You want consistent class ordering across your codebase
- ✅ You want to follow Tailwind's recommended class order
- ✅ You want automatic class sorting on save/format

For projects without Tailwind, use [`@jmlweb/prettier-config-base`](../prettier-config-base) instead.

## 🔗 Related Packages

- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Base Prettier configuration (extended by this package)
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config for TypeScript projects

## ⚠️ Important Notes

1. **Plugin Installation**: Make sure `prettier-plugin-tailwindcss` is installed. It's a peer dependency.
2. **Class Ordering**: The plugin uses Tailwind's recommended class order. This may differ from your current ordering.
3. **Performance**: The plugin must be loaded last in Prettier's plugin chain (it handles this automatically).

## 📝 Requirements

- **Node.js** >= 18.0.0
- **Prettier** >= 3.0.0
- **prettier-plugin-tailwindcss** (peer dependency)

## 📄 License

MIT
