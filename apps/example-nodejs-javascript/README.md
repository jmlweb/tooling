# Node.js JavaScript Example

This example demonstrates how to use `@jmlweb` tooling packages in a Node.js JavaScript project (without TypeScript).

## Packages Used

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - Code formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../../packages/oxlint-config-node) - Node.js linting

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
├── oxlint.config.ts     # Extends @jmlweb/oxlint-config-node
└── oxfmt.config.ts      # Uses @jmlweb/oxfmt-config-base
```

## Key Features

- ✅ Pure JavaScript (no TypeScript)
- ✅ Oxlint with ESLint's recommended rules and Node.js rules (`eslint-plugin-n`)
- ✅ Oxfmt for consistent formatting
- ✅ Express.js API example
- ✅ Automatic import sorting

## Configuration Files

### `oxlint.config.ts`

```typescript
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
});
```

### `oxfmt.config.ts`

```typescript
import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
});
```

## Import Sorting

Oxfmt sorts imports when formatting, in the same order as `eslint-plugin-perfectionist`:

**Before:**

<!-- prettier-ignore -->
```javascript
import { Component } from './component';
import express from 'express';
import './polyfill';
import fs from 'node:fs';
```

**After formatting:**

```javascript
import express from 'express';
import fs from 'node:fs';

import './polyfill';
import { Component } from './component';
```

Side-effect imports such as `./polyfill` are sorted too, so keep order-dependent ones in a separate entry file.

Sort imports and format the code:

```bash
npm run format
```

## Requirements

- Node.js >= 22.12.0
