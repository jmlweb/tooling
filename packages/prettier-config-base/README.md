# @jmlweb/prettier-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/prettier-config-base)](https://www.npmjs.com/package/@jmlweb/prettier-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

> Base Prettier configuration package that provides shared formatting rules for consistent code style across projects.

## ✨ Features

- 🎯 **Consistent Formatting**: Standardized code style across all projects
- 🔧 **Zero Configuration**: Works out of the box with sensible defaults
- 📦 **Extensible**: Foundation for framework-specific Prettier configs
- 🚀 **Modern Defaults**: Optimized for modern JavaScript/TypeScript projects

## 📦 Installation

```bash
npm install --save-dev @jmlweb/prettier-config-base prettier
```

## 🚀 Quick Start

### Option 1: Using `package.json` (Recommended)

Add to your `package.json`:

```json
{
  "prettier": "@jmlweb/prettier-config-base"
}
```

### Option 2: Using `.prettierrc.js`

Create a `.prettierrc.js` file in your project root:

```javascript
module.exports = require('@jmlweb/prettier-config-base');
```

### Option 3: Using `.prettierrc.json`

Create a `.prettierrc.json` file:

```json
"@jmlweb/prettier-config-base"
```

## 📋 Configuration

This package provides the following Prettier settings:

| Option          | Value        | Description                                |
| --------------- | ------------ | ------------------------------------------ |
| `semi`          | `true`       | Use semicolons at the end of statements    |
| `singleQuote`   | `true`       | Use single quotes instead of double quotes |
| `tabWidth`      | `2`          | Use 2 spaces for indentation               |
| `trailingComma` | `'all'`      | Add trailing commas wherever possible      |
| `useTabs`       | `false`      | Use spaces instead of tabs                 |
| `endOfLine`     | `'lf'`       | Use LF line endings (Unix-style)           |
| `proseWrap`     | `'preserve'` | Preserve prose wrapping in markdown files  |

## 💡 Examples

### Before Formatting

```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };
function greet(user) {
  return 'Hello, ' + user.name + '!';
}
```

### After Formatting

```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

function greet(user) {
  return 'Hello, ' + user.name + '!';
}
```

## 🎯 When to Use

Use this package when you want:

- ✅ Consistent code formatting across projects
- ✅ Zero-configuration Prettier setup
- ✅ Modern JavaScript/TypeScript formatting defaults
- ✅ Foundation for extending with framework-specific configs

**For Tailwind CSS projects**, use [`@jmlweb/prettier-config-tailwind`](../prettier-config-tailwind) instead.

## 🔧 Extending the Configuration

You can extend this config for project-specific needs:

```javascript
// .prettierrc.js
const baseConfig = require('@jmlweb/prettier-config-base');

module.exports = {
  ...baseConfig,
  // Override or add specific options
  printWidth: 100,
  arrowParens: 'always',
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
npm run format        # Format all files
npm run format:check  # Check formatting without modifying files
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Prettier** >= 3.0.0

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `prettier` (>= 3.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example
- [`example-nodejs-javascript`](../../apps/example-nodejs-javascript) - Node.js JavaScript example

## 🔗 Related Packages

- [`@jmlweb/prettier-config-tailwind`](../prettier-config-tailwind) - Adds Tailwind CSS class sorting
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config that works seamlessly with this Prettier config

## 📄 License

MIT
