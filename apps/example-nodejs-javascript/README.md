# 🟨 Node.js JavaScript Example

Express API in plain JavaScript, linted and formatted with the `@jmlweb` Oxc configs.

## 📦 Packages

- [`@jmlweb/oxfmt-config-base`](../../packages/oxfmt-config-base) - formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../../packages/oxlint-config-node) - Node.js linting (`eslint-plugin-n`)

## 🚀 Scripts

| Script                         | Does               |
| ------------------------------ | ------------------ |
| `pnpm start`                   | Run `src/index.js` |
| `pnpm lint` / `lint:fix`       | Oxlint             |
| `pnpm format` / `format:check` | Oxfmt              |

## 📁 Structure

```text
src/index.js        # API server
oxlint.config.ts    # Extends oxlint-config-node
oxfmt.config.ts     # Spreads oxfmt-config-base
```

## ⚙️ Config

```typescript
// oxlint.config.ts
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
});
```

```typescript
// oxfmt.config.ts
import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
});
```

Oxfmt also sorts imports, side-effect imports included, so keep order-dependent ones in a separate entry file.

Requires Node.js >= 22.12.0.
