# Node.js TypeScript API Example

This example demonstrates how to use `@jmlweb` tooling packages in a Node.js TypeScript API project.

## Packages Used

- [`@jmlweb/prettier-config-base`](../../packages/prettier-config-base) - Code formatting
- [`@jmlweb/eslint-config-base`](../../packages/eslint-config-base) - TypeScript linting with strict rules
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

```
nodejs-typescript-api/
├── src/
│   ├── index.ts          # Main API server
│   └── index.test.ts     # Tests
├── dist/                 # Compiled output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # Extends @jmlweb/tsconfig-base
├── eslint.config.js      # Uses @jmlweb/eslint-config-base
└── vitest.config.ts      # Uses @jmlweb/vitest-config
```

## Key Features

- ✅ Strict TypeScript configuration
- ✅ ESLint with strict type checking
- ✅ Prettier for consistent formatting
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

### `eslint.config.js`

```javascript
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
];
```

### `package.json`

```json
{
  "prettier": "@jmlweb/prettier-config-base"
}
```

## Requirements

- Node.js >= 20.11.0 (required for ESLint config)
