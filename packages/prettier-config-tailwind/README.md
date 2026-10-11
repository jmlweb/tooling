# @jmlweb/prettier-config-tailwind

[![npm version](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind)](https://www.npmjs.com/package/@jmlweb/prettier-config-tailwind)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)

> Prettier configuration with Tailwind CSS class sorting. Extends [`@jmlweb/prettier-config-base`](../prettier-config-base).

> 🔧 **Maintenance mode**: dependency and security updates only, no new rules. New projects should use [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) with its `sortTailwindcss` option. To migrate, see the [migration guide](https://jmlweb.github.io/tooling/guides/migrate-to-oxc/).

## ✨ Features

- 🎨 **Class sorting**: orders Tailwind classes in the recommended order
- 🔧 **Base included**: inherits every setting from `@jmlweb/prettier-config-base`
- 📦 **Plugin bundled**: ships `prettier-plugin-tailwindcss` as a dependency
- 🚀 **Zero config**: works out of the box

## 📦 Installation

```bash
npm install --save-dev @jmlweb/prettier-config-tailwind prettier
```

> 💡 Upgrading? See the [Migration Guide](#-migration-guide).

## 🚀 Quick Start

Create `.prettierrc.mjs`:

```javascript
export { default } from '@jmlweb/prettier-config-tailwind';
```

Alternatives:

```json
{
  "prettier": "@jmlweb/prettier-config-tailwind"
}
```

> ⚠️ In projects with `"type": "module"`, the `package.json` field can make Prettier warn `Ignored unknown option { default: ... }` and skip the config (no class sorting). Use `.prettierrc.mjs` instead.

For CommonJS (`.prettierrc.cjs`):

```javascript
module.exports = require('@jmlweb/prettier-config-tailwind');
```

## 💡 Examples

Before:

```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</button>
```

After:

```jsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Click me
</button>
```

## 📋 Configuration Details

The config is the [base config](../prettier-config-base#-configuration-details) plus:

| Option    | Value                             | Description                |
| --------- | --------------------------------- | -------------------------- |
| `plugins` | `['prettier-plugin-tailwindcss']` | Sorts Tailwind CSS classes |

## 🎯 When to Use

- ✅ Projects using Tailwind CSS
- ✅ Automatic, consistent class order

Not for you if:

- No Tailwind: use [`@jmlweb/prettier-config-base`](../prettier-config-base)
- New projects: use [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base)

## 🔧 Extending the Configuration

```javascript
// .prettierrc.mjs
import tailwindConfig from '@jmlweb/prettier-config-tailwind';

export default {
  ...tailwindConfig,
  printWidth: 100,
};
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

```bash
npm run format        # format all files
npm run format:check  # check without writing
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Prettier** >= 3.0.0

## 📦 Peer Dependencies

- `prettier` (`^3.0.0`)

`prettier-plugin-tailwindcss` is a regular dependency, so it needs no separate install.

## 🔗 Related Packages

- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Base config extended by this package
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Recommended Oxfmt replacement

## 🔄 Migration Guide

### 1.x to 2.0

**Breaking:** Node.js >= 22.12.0 is required (18 and 20 are end-of-life).

1. Upgrade Node.js to 22.12.0 or later.
2. Update: `npm install --save-dev @jmlweb/prettier-config-tailwind@latest`

See the [Changelog](./CHANGELOG.md) for details.

## 📄 License

MIT
