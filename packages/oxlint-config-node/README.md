# @jmlweb/oxlint-config-node

[![npm version](https://img.shields.io/npm/v/@jmlweb/oxlint-config-node)](https://www.npmjs.com/package/@jmlweb/oxlint-config-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)

> [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for Node.js. Extends [`@jmlweb/oxlint-config-base`](../oxlint-config-base) and ports [`@jmlweb/eslint-config-node`](../eslint-config-node). Recommended linter for Node.js projects.

## ✨ Features

- 🟢 **eslint-plugin-n**: `flat/recommended` plus stricter best practices, run as an Oxlint JS plugin
- ⚡ **Native where possible**: Rules Oxlint implements itself use its faster `node/*` version
- 📦 **Dependency checks**: Missing, extraneous and unpublished imports, resolved against `package.json`
- 🌐 **Node.js globals**: `process`, `Buffer`, `__dirname` and the rest, for JS and TS files
- 🔒 **Everything from the base config**: Strict TypeScript rules, no enums, named exports only

## 📦 Installation

```bash
npm install --save-dev @jmlweb/oxlint-config-node oxlint oxlint-tsgolint eslint-plugin-n
```

## 🚀 Quick Start

Create `oxlint.config.ts` in your project root:

```typescript
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
  options: {
    typeAware: true,
  },
});
```

> ⚠️ **Set `typeAware` in your own config.** Oxlint reads `options` only from the root config, so type-aware rules are skipped without it.

## 💡 Examples

### Before

```typescript
import fs from 'fs';
import { parse } from 'yaml';

export const loadConfig = (dir: string): unknown => {
  const file = dir + '/config.yml';
  if (!fs.existsSync(file)) {
    process.exit(1);
  }
  fs.readFile(file, 'utf8', () => undefined);
  return parse(fs.readFileSync(file, 'utf8'));
};
```

### Problems Reported

With `yaml` missing from `package.json`:

```text
src/config.ts:1:16: error n(prefer-node-protocol): Prefer `node:fs` over `fs`.
src/config.ts:2:23: error n(no-missing-import): Can't resolve 'yaml' in '/path/to/project/src'
src/config.ts:7:5: error n(no-process-exit): Don't use process.exit(); throw an error instead.
src/config.ts:9:3: error n(prefer-promises/fs): Use 'fs.promises.readFile()' instead.
src/config.ts:10:10: error typescript(no-unsafe-call): Unsafe call of a(n) `error` type typed value.
```

## 📋 Configuration Details

**All files**: `eslint-plugin-n` `flat/recommended` rules (deprecated APIs, features unsupported by your `engines.node`, missing/extraneous/unpublished imports, hashbangs) plus the rules below. Node.js globals apply to `**/*.{js,mjs,cjs,ts,mts,cts}` through an override, because Oxlint drops a top-level `env` from configs loaded through `extends`.

| Rule                      | Level   | Description                                         |
| ------------------------- | ------- | --------------------------------------------------- |
| `n/no-process-exit`       | `error` | Throw instead of calling `process.exit()`           |
| `n/process-exit-as-throw` | `error` | Treats `process.exit()` as a throw for control flow |
| `n/no-deprecated-api`     | `warn`  | Flags deprecated Node.js APIs                       |
| `n/no-callback-literal`   | `error` | Callbacks receive an error or `null` first          |
| `n/prefer-node-protocol`  | `error` | Use `node:` imports for built-ins                   |
| `n/prefer-promises/fs`    | `error` | Use `fs.promises` over callback APIs                |
| `n/prefer-promises/dns`   | `error` | Use `dns.promises` over callback APIs               |
| `n/prefer-global/*`       | `error` | Use `Buffer`, `console`, `process`, `URL` globals   |
| `node/no-new-require`     | `error` | No `new require(...)`                               |
| `node/no-path-concat`     | `error` | Use `path.join()` with `__dirname`/`__filename`     |
| `node/no-exports-assign`  | `error` | No assigning to `exports`                           |

`node/*` rules are Oxlint's native versions of the matching `n/*` rules; the rest run through the JS plugin (still in alpha in Oxlint).

### Differences from `@jmlweb/eslint-config-node`

- **No `naming-convention`**: see [`@jmlweb/oxlint-config-base`](../oxlint-config-base)
- **No import sorting**: [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) sorts imports

## 🎯 When to Use

- ✅ Fast linting for Node.js libraries, CLIs and servers (recommended)
- ✅ Checking that every import is declared in `package.json`
- ✅ Migrating from `@jmlweb/eslint-config-node` (maintenance mode)

**Browser or React**, use [`@jmlweb/oxlint-config-base`](../oxlint-config-base) or [`@jmlweb/oxlint-config-react`](../oxlint-config-react).

## 🔧 Extending the Configuration

```typescript
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
  options: {
    typeAware: true,
  },
  overrides: [
    {
      // CLIs may exit with a status code
      files: ['src/cli.ts'],
      rules: {
        'n/no-process-exit': 'off',
      },
    },
    {
      // Scripts and tests may import devDependencies
      files: ['scripts/**', '**/*.test.ts'],
      rules: {
        'n/no-unpublished-import': 'off',
      },
    },
  ],
});
```

### CLIs Built to `dist/`

`eslint-plugin-n` compares sources with the `bin` and `files` paths in `package.json`, which point at build output. That triggers `n/hashbang` ("This file needs no shebang.") on `src/cli.ts`, and `n/no-missing-import` on scripts that import build output before it exists. Map sources to output with `n.convertPath` and turn the rule off for post-build scripts:

```typescript
import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
  settings: {
    n: {
      convertPath: [
        {
          include: ['src/**/*.ts'],
          replace: ['^src/(.+)\\.ts$', 'dist/$1.js'],
        },
      ],
    },
  },
  overrides: [
    {
      files: ['scripts/**'],
      rules: {
        'n/no-missing-import': 'off',
      },
    },
  ],
});
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

```bash
npm run lint      # Lint all files
npm run lint:fix  # Fix auto-fixable problems
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Oxlint** >= 1.87.0
- **`engines.node`** in your `package.json` (used by the unsupported-feature rules)
- **TypeScript project** with a `tsconfig.json` (for type-aware rules)

## 📦 Peer Dependencies

- `oxlint` (>=1.87.0)
- `oxlint-tsgolint` (>=7.0.0, optional): enables type-aware rules
- `eslint-plugin-n` (^17.0.0 || ^18.0.0)

`@jmlweb/oxlint-config-base` is a regular dependency; do not install it separately.

## 🔗 Related Packages

- [`@jmlweb/oxlint-config-base`](../oxlint-config-base) - Base config this package extends
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt config, the formatter to pair with this linter
- [`@jmlweb/tsconfig-node`](../tsconfig-node) - TypeScript config for Node.js
- [`@jmlweb/eslint-config-node`](../eslint-config-node) - ESLint equivalent (maintenance mode)

## 📄 License

MIT
