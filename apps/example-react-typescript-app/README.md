# ⚛️ React TypeScript App Example

React 19 + Tailwind CSS 4 + Vite app using the `@jmlweb` Oxc, tsconfig and Vitest configs.

## 📦 Packages

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - formatting, import and Tailwind class sorting
- [`@jmlweb/oxlint-config-react`](../../packages/oxlint-config-react) - React, React Compiler and type-aware TypeScript linting
- [`@jmlweb/tsconfig-react`](../../packages/tsconfig-react) - TypeScript config for React
- [`@jmlweb/vitest-config`](../../packages/vitest-config) - test config

## 🚀 Scripts

| Script                         | Does                         |
| ------------------------------ | ---------------------------- |
| `pnpm dev`                     | Vite dev server              |
| `pnpm build` / `preview`       | `tsc` + Vite build / preview |
| `pnpm test` / `test:coverage`  | Vitest (jsdom)               |
| `pnpm lint` / `lint:fix`       | Oxlint                       |
| `pnpm format` / `format:check` | Oxfmt                        |
| `pnpm typecheck`               | `tsc --noEmit`               |

## 📁 Structure

```text
src/
├── App.tsx / App.test.tsx   # Component and test
├── main.tsx                 # Entry point
├── index.css                # Tailwind import (used for class sorting)
└── test-setup.ts            # Test setup
index.html
tsconfig.json       # Extends tsconfig-react
oxlint.config.ts    # Extends oxlint-config-react, type-aware
oxfmt.config.ts     # oxfmt-config-base + sortTailwindcss
vitest.config.ts    # vitest-config + React plugin, jsdom
vite.config.ts      # React plugin
```

## ⚙️ Config

```typescript
// oxlint.config.ts
import reactConfig from '@jmlweb/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
  options: { typeAware: true },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    // Outside tsconfig.json, so type-aware rules cannot resolve their imports
    '*.config.ts',
  ],
});
```

```typescript
// oxfmt.config.ts
import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
  sortTailwindcss: { stylesheet: './src/index.css' },
});
```

```typescript
// vitest.config.ts (reporters trimmed)
import baseConfig from '@jmlweb/vitest-config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

Requires Node.js >= 22.12.0.
