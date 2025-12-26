# @jmlweb/postcss-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/postcss-config)](https://www.npmjs.com/package/@jmlweb/postcss-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

> PostCSS configuration for Tailwind CSS projects. Includes Tailwind CSS and Autoprefixer plugins with sensible defaults.

## Features

- Tailwind CSS plugin for utility-first CSS
- Autoprefixer for automatic vendor prefixes
- Zero configuration needed
- Works with PostCSS 8+

## Installation

```bash
npm install --save-dev @jmlweb/postcss-config postcss tailwindcss autoprefixer
```

## Quick Start

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

## Configuration

This package provides a PostCSS configuration with the following plugins:

| Plugin         | Description                       |
| -------------- | --------------------------------- |
| `tailwindcss`  | Utility-first CSS framework       |
| `autoprefixer` | Adds vendor prefixes to CSS rules |

## Extending the Configuration

You can extend this config for project-specific needs:

```javascript
// postcss.config.js
import config from '@jmlweb/postcss-config';

export default {
  ...config,
  plugins: {
    ...config.plugins,
    // Add additional plugins
    'postcss-import': {},
  },
};
```

## Requirements

- **Node.js** >= 18.0.0
- **PostCSS** >= 8.0.0
- **Tailwind CSS** >= 3.0.0
- **Autoprefixer** >= 10.0.0

## Peer Dependencies

This package requires the following peer dependencies:

- `postcss` (>= 8.0.0)
- `tailwindcss` (>= 3.0.0 or >= 4.0.0)
- `autoprefixer` (>= 10.0.0)

## Examples

See real-world usage examples:

- [`example-react-typescript-app`](../../apps/example-react-typescript-app) - React TypeScript app with Tailwind CSS

## Related Packages

- [`@jmlweb/prettier-config-tailwind`](../prettier-config-tailwind) - Prettier config with Tailwind class sorting
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint config for React projects

## License

MIT
