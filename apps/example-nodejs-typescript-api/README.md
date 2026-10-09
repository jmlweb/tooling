# Node.js TypeScript API Example

This example demonstrates how to use `@jmlweb` tooling packages in a Node.js TypeScript API project.

## Packages Used

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - Code formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../../packages/oxlint-config-node) - Node.js and strict TypeScript linting
- [`@jmlweb/tsconfig-base`](../../packages/tsconfig-base) - TypeScript configuration
- [`@jmlweb/vitest-config`](../../packages/vitest-config) - Testing configuration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Run tests:

```bash
npm test
```

4. Format code:

```bash
npm run format
```

5. Lint code:

```bash
npm run lint
```

## Project Structure

```text
nodejs-typescript-api/
├── src/
│   ├── index.ts          # Main API server
│   └── index.test.ts     # Tests
├── dist/                 # Compiled output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # Extends @jmlweb/tsconfig-base
├── oxlint.config.ts      # Extends @jmlweb/oxlint-config-node
├── oxfmt.config.ts       # Uses @jmlweb/oxfmt-config-base
└── vitest.config.ts      # Uses @jmlweb/vitest-config
```

## Key Features

- ✅ Strict TypeScript configuration
- ✅ Oxlint with type-aware TypeScript rules and Node.js rules (`eslint-plugin-n`)
- ✅ Oxfmt for consistent formatting and import sorting
- ✅ Vitest for testing with coverage
- ✅ Express.js API example

## Configuration Files

### `tsconfig.json`

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `oxlint.config.ts`

```typescript
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
  options: {
    typeAware: true,
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    // Outside tsconfig.json, so type-aware rules cannot resolve their imports
    '*.config.ts',
  ],
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

## Requirements

- Node.js >= 22.12.0
