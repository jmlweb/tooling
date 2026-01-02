# React TypeScript App Example

This example demonstrates how to use `@jmlweb` tooling packages in a React TypeScript application with Tailwind CSS.

## Packages Used

- [`@jmlweb/prettier-config-tailwind`](../../packages/prettier-config-tailwind) - Code formatting with Tailwind class sorting
- [`@jmlweb/eslint-config-react`](../../packages/eslint-config-react) - React + TypeScript linting with strict rules
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
├── eslint.config.js     # Uses @jmlweb/eslint-config-react
├── vitest.config.ts     # Uses @jmlweb/vitest-config
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Key Features

- ✅ React 18 with TypeScript
- ✅ Tailwind CSS with automatic class sorting
- ✅ ESLint with React and strict TypeScript rules
- ✅ Prettier with Tailwind plugin
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

### `eslint.config.js`

```javascript
import reactConfig from "@jmlweb/eslint-config-react";

export default [
  ...reactConfig,
  {
    ignores: ["dist/", "node_modules/", "coverage/", "*.config.js"],
  },
];
```

### `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import baseConfig from "@jmlweb/vitest-config";

export default defineConfig({
  plugins: [react()],
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: "jsdom",
  },
});
```

### `package.json`

```json
{
  "prettier": "@jmlweb/prettier-config-tailwind"
}
```

## Tailwind CSS Class Sorting

The Prettier config automatically sorts Tailwind CSS classes in the recommended order:

**Before:**

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
  Click me
</button>
```

**After formatting:**

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
  Click me
</button>
```

## Requirements

- Node.js >= 20.11.0 (required for ESLint config)
