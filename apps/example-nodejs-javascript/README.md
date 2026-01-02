# Node.js JavaScript Example

This example demonstrates how to use `@jmlweb` tooling packages in a Node.js JavaScript project (without TypeScript).

## Packages Used

- [`@jmlweb/prettier-config-base`](../../packages/prettier-config-base) - Code formatting
- [`@jmlweb/eslint-config-base-js`](../../packages/eslint-config-base-js) - JavaScript linting

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the server:

```bash
npm start
```

3. Format code:

```bash
npm run format
```

4. Lint code:

```bash
npm run lint
```

## Project Structure

```text
nodejs-javascript/
├── src/
│   └── index.js         # Main API server
├── package.json         # Dependencies and scripts
└── eslint.config.js     # Uses @jmlweb/eslint-config-base-js
```

## Key Features

- ✅ Pure JavaScript (no TypeScript)
- ✅ ESLint with recommended JavaScript rules
- ✅ Prettier for consistent formatting
- ✅ Express.js API example
- ✅ Automatic import sorting

## Configuration Files

### `eslint.config.js`

```javascript
import baseJsConfig from '@jmlweb/eslint-config-base-js';
import globals from 'globals';

export default [
  ...baseJsConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
```

### `package.json`

```json
{
  "prettier": "@jmlweb/prettier-config-base"
}
```

## Import Sorting

The ESLint config automatically sorts imports:

**Before:**

```javascript
import './polyfill';
import { Component } from './component';
import express from 'express';
import fs from 'fs';
```

**After auto-fix:**

```javascript
import './polyfill';
import fs from 'fs';
import express from 'express';
import { Component } from './component';
```

Fix import order automatically:

```bash
npm run lint:fix
```

## Requirements

- Node.js >= 18.0.0
