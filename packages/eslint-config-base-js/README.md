# @jmlweb/eslint-config-base-js

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-base-js)](https://www.npmjs.com/package/@jmlweb/eslint-config-base-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3.svg)](https://eslint.org/)

> Base ESLint configuration for JavaScript projects. Foundation for JavaScript-only projects and extended by TypeScript configs. Uses ESLint 9+ flat config format.

## ✨ Features

- 🎯 **JavaScript Support**: Recommended ESLint rules for modern JavaScript (ES modules)
- 📦 **Import Sorting**: Automatic import and export sorting via `eslint-plugin-simple-import-sort`
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🌐 **Environment Agnostic**: Works for both Node.js and browser projects
- 🚀 **Flat Config**: Uses ESLint 9+ flat config format (latest stable)
- 🔧 **Modular Design**: Designed to be extended by other configs (e.g., TypeScript)

## 📦 Installation

```bash
npm install --save-dev @jmlweb/eslint-config-base-js eslint @eslint/js eslint-config-prettier eslint-plugin-simple-import-sort
```

## 🚀 Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import baseJsConfig from '@jmlweb/eslint-config-base-js';

export default [
  ...baseJsConfig,
  // Add your project-specific overrides here
];
```

## 💡 Examples

### Basic Setup

```javascript
// eslint.config.js
import baseJsConfig from '@jmlweb/eslint-config-base-js';

export default [...baseJsConfig];
```

### With Project-Specific Rules

```javascript
// eslint.config.js
import baseJsConfig from '@jmlweb/eslint-config-base-js';

export default [
  ...baseJsConfig,
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    rules: {
      'no-console': 'off', // Allow console in tests
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.config.js'],
  },
];
```

### Node.js Project

```javascript
// eslint.config.js
import baseJsConfig from '@jmlweb/eslint-config-base-js';

export default [
  ...baseJsConfig,
  {
    languageOptions: {
      globals: {
        // Add Node.js globals if needed
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
];
```

### Browser Project

```javascript
// eslint.config.js
import baseJsConfig from '@jmlweb/eslint-config-base-js';
import globals from 'globals';

export default [
  ...baseJsConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
```

## 📋 Configuration Details

### JavaScript Files

The base configuration applies to:

- `**/*.js` - Standard JavaScript files
- `**/*.mjs` - ES modules
- `**/*.cjs` - CommonJS files

### Included Rules

- ✅ ESLint recommended rules (`@eslint/js`)
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution

## 🔄 Import Sorting

The configuration automatically sorts imports and exports. The default sorting order is:

1. **Side effect imports** (e.g., `import 'polyfill'`)
2. **Node.js built-in modules** (e.g., `import fs from 'fs'`)
3. **External packages** (e.g., `import react from 'react'`)
4. **Internal absolute imports** (e.g., `import utils from '@/utils'`)
5. **Relative imports** (e.g., `import './component'`)

### Example

**Before:**

```javascript
import './styles.css';
import { Component } from './component';
import React from 'react';
import fs from 'fs';
import { utils } from '@/utils';
```

**After auto-fix:**

```javascript
import './styles.css';
import fs from 'fs';
import React from 'react';
import { utils } from '@/utils';
import { Component } from './component';
```

Fix import order automatically:

```bash
npx eslint --fix .
```

## 🎨 Prettier Integration

This configuration disables all ESLint rules that conflict with Prettier, allowing Prettier to handle all code formatting.

**Recommended**: Use [`@jmlweb/prettier-config-base`](../prettier-config-base) for consistent formatting.

## 🎯 When to Use

Use this package when you want:

- ✅ JavaScript-only projects (no TypeScript)
- ✅ Modern JavaScript linting with ESLint 9+ flat config
- ✅ Automatic import/export sorting
- ✅ Foundation for extending with TypeScript or React configs

**For TypeScript projects**, use [`@jmlweb/eslint-config-base`](../eslint-config-base) instead, which extends this config with strict type checking.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
import baseJsConfig from '@jmlweb/eslint-config-base-js';

export default [
  ...baseJsConfig,
  {
    files: ['**/*.test.js'],
    rules: {
      // Test-specific rules
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
];
```

## 📝 Usage with Scripts

Add linting scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Then run:

```bash
npm run lint      # Lint all files
npm run lint:fix  # Fix auto-fixable issues
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **ESLint** >= 9.0.0 (flat config format)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `eslint` (^9.0.0)
- `@eslint/js` (^9.0.0)
- `eslint-config-prettier` (^9.1.0)
- `eslint-plugin-simple-import-sort` (^12.0.0)

**Note**: This package does NOT require `typescript-eslint` as it's for JavaScript-only projects.

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-javascript`](../../apps/example-nodejs-javascript) - Node.js JavaScript example

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - TypeScript ESLint config (extends this package)
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
