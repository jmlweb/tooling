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

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

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

### Internal Packages

- [`@jmlweb/prettier-config-tailwind`](../prettier-config-tailwind) - Adds Tailwind CSS class sorting
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint config that works seamlessly with this Prettier config

### External Tools

- [Prettier](https://prettier.io/) - Opinionated code formatter
- [ESLint](https://eslint.org/) - Pluggable linting utility (use with eslint-config-prettier to avoid conflicts)
- [Editor Plugins](https://prettier.io/docs/en/editors.html) - Format on save in VS Code, IntelliJ, and more

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### Conflicts with ESLint

**Symptoms:**

- Code gets formatted by Prettier then changed back by ESLint auto-fix
- Linting errors about formatting (quotes, semicolons, etc.)

**Cause:**

- ESLint has formatting rules that conflict with Prettier
- Both tools trying to format the same code

**Solution:**

Install `eslint-config-prettier` to disable conflicting ESLint rules:

```bash
npm install --save-dev eslint-config-prettier
```

Then add it to your ESLint config (must be last):

```javascript
// eslint.config.js (flat config)
import prettier from 'eslint-config-prettier';

export default [
  // ... other configs
  prettier, // Must be last!
];
```

Or use [`@jmlweb/eslint-config-base`](../eslint-config-base) which already includes this integration.

### IDE Not Formatting on Save

**Symptoms:**

- Files don't format automatically when saving
- Manual format command works but auto-format doesn't

**Cause:**

- IDE Prettier extension not installed or configured
- Wrong formatter selected as default

**Solution:**

For VS Code, install the Prettier extension and add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Configuration Not Being Picked Up

**Symptoms:**

- Prettier uses default settings instead of your config
- Custom options not applied

**Cause:**

- Configuration file not in the correct location
- Multiple config files conflicting

**Solution:**

1. Ensure config is in project root (not nested directories)
2. Use only one configuration method (package.json OR .prettierrc)
3. Check for conflicting configs in parent directories
4. Restart your IDE/editor

To verify Prettier finds your config:

```bash
npx prettier --find-config-path src/index.ts
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
