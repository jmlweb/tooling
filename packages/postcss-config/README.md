# @jmlweb/postcss-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/postcss-config)](https://www.npmjs.com/package/@jmlweb/postcss-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

> PostCSS configuration for Tailwind CSS projects. Includes Tailwind CSS and Autoprefixer plugins with sensible defaults.

## ✨ Features

- 🎨 **Tailwind CSS**: Utility-first CSS framework integration
- 🔧 **Autoprefixer**: Automatic vendor prefixes for cross-browser compatibility
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 📦 **PostCSS 8+**: Compatible with the latest PostCSS version

## 📦 Installation

```bash
npm install --save-dev @jmlweb/postcss-config postcss tailwindcss autoprefixer
```

## 🚀 Quick Start

### Option 1: Using `postcss.config.js` (Recommended)

Create a `postcss.config.js` file in your project root:

```javascript
export { default } from '@jmlweb/postcss-config';
```

Or for CommonJS:

```javascript
module.exports = require('@jmlweb/postcss-config').default;
```

### Option 2: Direct Import

```javascript
// postcss.config.js
import config from '@jmlweb/postcss-config';

export default config;
```

## 💡 Examples

### Basic Tailwind CSS Project

```javascript
// postcss.config.js
export { default } from '@jmlweb/postcss-config';
```

```css
/* src/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### With Vite

```javascript
// postcss.config.js
export { default } from '@jmlweb/postcss-config';
```

Vite automatically detects the PostCSS config.

### With Next.js

```javascript
// postcss.config.js
module.exports = require('@jmlweb/postcss-config').default;
```

Next.js uses CommonJS by default for PostCSS config.

## 📋 Configuration Details

This package provides a PostCSS configuration with the following plugins:

| Plugin         | Description                       |
| -------------- | --------------------------------- |
| `tailwindcss`  | Utility-first CSS framework       |
| `autoprefixer` | Adds vendor prefixes to CSS rules |

### Plugin Order

Plugins are applied in the following order:

1. **Tailwind CSS** - Processes Tailwind directives and utilities
2. **Autoprefixer** - Adds vendor prefixes to the generated CSS

## 🎯 When to Use

Use this configuration when you want:

- ✅ Tailwind CSS with automatic vendor prefixing
- ✅ Consistent PostCSS setup across projects
- ✅ Zero-configuration Tailwind CSS integration
- ✅ Modern CSS with cross-browser compatibility

**For projects without Tailwind CSS**, you may want to create a custom PostCSS config with only the plugins you need.

## 🔧 Extending the Configuration

You can extend this config for project-specific needs:

### Adding Additional Plugins

```javascript
// postcss.config.js
import config from '@jmlweb/postcss-config';

export default {
  ...config,
  plugins: {
    ...config.plugins,
    // Add additional plugins
    'postcss-import': {},
    'postcss-nesting': {},
  },
};
```

### Custom Plugin Order

```javascript
// postcss.config.js
import config from '@jmlweb/postcss-config';

export default {
  plugins: {
    'postcss-import': {},
    ...config.plugins,
    cssnano: { preset: 'default' },
  },
};
```

## 📝 Usage with Scripts

Add build scripts to your `package.json`:

```json
{
  "scripts": {
    "build:css": "postcss src/styles.css -o dist/styles.css",
    "watch:css": "postcss src/styles.css -o dist/styles.css --watch"
  }
}
```

Then run:

```bash
npm run build:css    # Build CSS
npm run watch:css    # Watch for changes
```

**Note**: Most bundlers (Vite, Next.js, Webpack) handle PostCSS automatically.

## 📋 Requirements

- **Node.js** >= 18.0.0
- **PostCSS** >= 8.0.0
- **Tailwind CSS** >= 3.0.0
- **Autoprefixer** >= 10.0.0

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `postcss` (>= 8.0.0)
- `tailwindcss` (>= 3.0.0 or >= 4.0.0)
- `autoprefixer` (>= 10.0.0)

## 🔗 Related Packages

- [`@jmlweb/prettier-config-tailwind`](../prettier-config-tailwind) - Prettier config with Tailwind class sorting
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint config for React projects
- [`@jmlweb/vite-config`](../vite-config) - Vite configuration for frontend projects

## 📄 License

MIT
