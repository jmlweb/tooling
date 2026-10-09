# React TypeScript App Example

This example demonstrates how to use `@jmlweb` tooling packages in a React TypeScript application with Tailwind CSS.

## Packages Used

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - Code formatting, import sorting and Tailwind class sorting
- [`@jmlweb/oxlint-config-react`](../../packages/oxlint-config-react) - React + TypeScript linting with strict rules
- [`@jmlweb/tsconfig-react`](../../packages/tsconfig-react) - TypeScript configuration for React
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
react-typescript-app/
├── src/
│   ├── App.tsx          # Main React component
│   ├── App.test.tsx     # Component tests
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind CSS imports
├── dist/                # Built output
├── package.json         # Dependencies and scripts
├── tsconfig.json        # Extends @jmlweb/tsconfig-react
├── oxlint.config.ts     # Extends @jmlweb/oxlint-config-react
├── oxfmt.config.ts      # Uses @jmlweb/oxfmt-config-base with Tailwind sorting
├── vitest.config.ts     # Uses @jmlweb/vitest-config
└── vite.config.ts       # Vite configuration
```

## Key Features

- ✅ React 19 with TypeScript
- ✅ Tailwind CSS 4 with automatic class sorting
- ✅ Oxlint with React, React Compiler and type-aware TypeScript rules
- ✅ Oxfmt for formatting, import sorting and Tailwind class sorting
- ✅ Vitest for testing with jsdom environment
- ✅ Vite for fast development and building

## Configuration Files

### `tsconfig.json`

```json
{
  "extends": "@jmlweb/tsconfig-react",
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
import reactConfig from '@jmlweb/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
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
  sortTailwindcss: {
    stylesheet: './src/index.css',
  },
});
```

### `vitest.config.ts`

```typescript
import baseConfig from '@jmlweb/vitest-config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
  },
});
```

## Tailwind CSS Class Sorting

Oxfmt sorts Tailwind CSS classes in the recommended order, reading the Tailwind setup from `src/index.css`:

**Before:**

<!-- prettier-ignore -->
```tsx
<button className="text-white px-4 rounded-lg py-2 bg-blue-500">Click me</button>
```

**After formatting:**

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
  Click me
</button>
```

## Requirements

- Node.js >= 22.12.0
