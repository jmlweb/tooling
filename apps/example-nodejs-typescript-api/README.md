# 🟢 Node.js TypeScript API Example

Express API in strict TypeScript, using the `@jmlweb` Oxc, tsconfig and Vitest configs.

## 📦 Packages

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../../packages/oxlint-config-node) - Node.js and type-aware TypeScript linting
- [`@jmlweb/tsconfig-base`](../../packages/tsconfig-base) - TypeScript config
- [`@jmlweb/vitest-config`](../../packages/vitest-config) - test config

## 🚀 Scripts

| Script                         | Does                     |
| ------------------------------ | ------------------------ |
| `pnpm dev`                     | Run `src/index.ts` (tsx) |
| `pnpm build` / `start`         | Compile to `dist/` / run |
| `pnpm test` / `test:coverage`  | Vitest                   |
| `pnpm lint` / `lint:fix`       | Oxlint                   |
| `pnpm format` / `format:check` | Oxfmt                    |
| `pnpm typecheck`               | `tsc --noEmit`           |

## 📁 Structure

```text
src/index.ts        # API server
src/index.test.ts   # Tests
tsconfig.json       # Extends tsconfig-base
oxlint.config.ts    # Extends oxlint-config-node, type-aware
oxfmt.config.ts     # Spreads oxfmt-config-base
vitest.config.ts    # Extends vitest-config, adds coverage reporters
```

## ⚙️ Config

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

```typescript
// oxlint.config.ts
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
  options: { typeAware: true },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    // Outside tsconfig.json, so type-aware rules cannot resolve their imports
    '*.config.ts',
  ],
});
```

`oxfmt.config.ts` spreads `@jmlweb/oxfmt-config-base`, as in the other examples.

Requires Node.js >= 22.12.0.
