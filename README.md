# 🧰 jmlweb-tooling

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-EF4444.svg)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)

Shared `@jmlweb/*` configs for formatting, linting, TypeScript, build, test and commits.

- 📚 **Docs:** [jmlweb.github.io/tooling](https://jmlweb.github.io/tooling/)
- 🤖 **For AI agents:** [`llms.txt`](https://jmlweb.github.io/tooling/llms.txt) · [`llms-full.txt`](https://jmlweb.github.io/tooling/llms-full.txt)
- 🔀 **Prettier/ESLint → Oxfmt/Oxlint:** [migration guide](https://jmlweb.github.io/tooling/guides/migrate-to-oxc/)

## 📦 Packages

✅ Recommended · 🛠️ Maintenance mode (existing projects) · ⚠️ Deprecated

| Package                                                                   | Status | Description                             | Version                                                                      |
| ------------------------------------------------------------------------- | ------ | --------------------------------------- | ---------------------------------------------------------------------------- |
| **🎨 Formatting**                                                         |        |                                         |                                                                              |
| [`@jmlweb/oxfmt-config-base`](./packages/oxfmt-config-base)               | ✅     | Oxfmt base config                       | ![npm](https://img.shields.io/npm/v/@jmlweb/oxfmt-config-base?label=)        |
| [`@jmlweb/prettier-config-base`](./packages/prettier-config-base)         | 🛠️     | Prettier base config                    | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-base?label=)     |
| [`@jmlweb/prettier-config-tailwind`](./packages/prettier-config-tailwind) | 🛠️     | Prettier + Tailwind CSS plugin          | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind?label=) |
| **🔍 Linting**                                                            |        |                                         |                                                                              |
| [`@jmlweb/oxlint-config-base`](./packages/oxlint-config-base)             | ✅     | Oxlint for JS/TS, type-aware            | ![npm](https://img.shields.io/npm/v/@jmlweb/oxlint-config-base?label=)       |
| [`@jmlweb/oxlint-config-react`](./packages/oxlint-config-react)           | ✅     | Oxlint for React                        | ![npm](https://img.shields.io/npm/v/@jmlweb/oxlint-config-react?label=)      |
| [`@jmlweb/oxlint-config-node`](./packages/oxlint-config-node)             | ✅     | Oxlint for Node.js                      | ![npm](https://img.shields.io/npm/v/@jmlweb/oxlint-config-node?label=)       |
| [`@jmlweb/eslint-config-base-js`](./packages/eslint-config-base-js)       | 🛠️     | ESLint for JavaScript                   | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base-js?label=)    |
| [`@jmlweb/eslint-config-base`](./packages/eslint-config-base)             | 🛠️     | ESLint for TypeScript (strict)          | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base?label=)       |
| [`@jmlweb/eslint-config-react`](./packages/eslint-config-react)           | 🛠️     | ESLint for React                        | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-react?label=)      |
| [`@jmlweb/eslint-config-node`](./packages/eslint-config-node)             | 🛠️     | ESLint for Node.js                      | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-node?label=)       |
| [`@jmlweb/eslint-config-astro`](./packages/eslint-config-astro)           | ✅     | ESLint for Astro (no Oxlint equivalent) | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-astro?label=)      |
| **🟦 TypeScript**                                                         |        |                                         |                                                                              |
| [`@jmlweb/tsconfig-base`](./packages/tsconfig-base)                       | ✅     | Strict base tsconfig                    | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-base?label=)            |
| [`@jmlweb/tsconfig-node`](./packages/tsconfig-node)                       | ✅     | Node.js and CLI (no DOM)                | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-node?label=)            |
| [`@jmlweb/tsconfig-react`](./packages/tsconfig-react)                     | ✅     | React libraries (JSX)                   | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-react?label=)           |
| [`@jmlweb/tsconfig-nextjs`](./packages/tsconfig-nextjs)                   | ✅     | Next.js apps                            | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-nextjs?label=)          |
| [`@jmlweb/tsconfig-astro`](./packages/tsconfig-astro)                     | ✅     | Astro projects                          | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-astro?label=)           |
| **🏗️ Build**                                                              |        |                                         |                                                                              |
| [`@jmlweb/tsdown-config-base`](./packages/tsdown-config-base)             | ✅     | tsdown base config                      | ![npm](https://img.shields.io/npm/v/@jmlweb/tsdown-config-base?label=)       |
| [`@jmlweb/tsup-config-base`](./packages/tsup-config-base)                 | ⚠️     | Use `@jmlweb/tsdown-config-base`        | ![npm](https://img.shields.io/npm/v/@jmlweb/tsup-config-base?label=)         |
| [`@jmlweb/vite-config`](./packages/vite-config)                           | ✅     | Vite base config, optional React        | ![npm](https://img.shields.io/npm/v/@jmlweb/vite-config?label=)              |
| **🧪 Testing**                                                            |        |                                         |                                                                              |
| [`@jmlweb/vitest-config`](./packages/vitest-config)                       | ✅     | Vitest with TypeScript and coverage     | ![npm](https://img.shields.io/npm/v/@jmlweb/vitest-config?label=)            |
| [`@jmlweb/jest-config`](./packages/jest-config)                           | ✅     | Jest with TypeScript and coverage       | ![npm](https://img.shields.io/npm/v/@jmlweb/jest-config?label=)              |
| **📝 Commits**                                                            |        |                                         |                                                                              |
| [`@jmlweb/commitlint-config`](./packages/commitlint-config)               | ✅     | Conventional Commits                    | ![npm](https://img.shields.io/npm/v/@jmlweb/commitlint-config?label=)        |

## 🔗 Package Hierarchy

```text
oxlint-config-base ──► oxlint-config-react | oxlint-config-node
prettier-config-base ──► prettier-config-tailwind
eslint-config-base-js ──► eslint-config-base ──► eslint-config-react | eslint-config-node | eslint-config-astro
tsconfig-base ──► tsconfig-node | tsconfig-astro | tsconfig-react ──► tsconfig-nextjs
```

Standalone: `oxfmt-config-base`, `tsdown-config-base`, `tsup-config-base`, `vite-config`, `vitest-config`, `jest-config`, `commitlint-config`.

## 🚀 Quick Start

### Oxfmt

```bash
pnpm add -D @jmlweb/oxfmt-config-base oxfmt
```

```typescript
// oxfmt.config.ts
import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
});
```

### Oxlint

```bash
pnpm add -D @jmlweb/oxlint-config-base oxlint oxlint-tsgolint
```

```typescript
// oxlint.config.ts
import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true, // must live in your root config; not inherited via extends
  },
});
```

Other packages: see each package README or the [docs site](https://jmlweb.github.io/tooling/).

## ⚙️ Requirements

| Scope                        | Node.js                                            |
| ---------------------------- | -------------------------------------------------- |
| Published packages           | `>= 22.12.0`                                       |
| `@jmlweb/tsdown-config-base` | `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` (as tsdown) |
| Developing this repo         | `>= 24.16.0` (`.nvmrc`: 24)                        |

Peer tool versions: see each package README. Policy: [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md).

## 🛠️ Development

```bash
pnpm install
pnpm build              # build all packages
pnpm test               # run all tests
pnpm validate           # format check + lint + syncpack
pnpm validate:docs      # docs structure and language
pnpm validate:packages  # package.json validation
pnpm check:exports      # publint + attw on built packages
pnpm format             # format with Oxfmt
pnpm syncpack:fix       # fix dependency version mismatches
pnpm changeset          # record a version bump
```

## 📂 Repository Layout

| Path                        | Content                                                |
| --------------------------- | ------------------------------------------------------ |
| [`packages/`](./packages)   | Publishable packages                                   |
| [`apps/`](./apps)           | Docs site, examples (Node.js TS/JS, React), test apps  |
| [`docs/`](./docs/README.md) | Technical docs: packages, publishing, CI, dependencies |
| [`scripts/`](./scripts)     | Validation and release helpers                         |

## 🤝 Contributing

1. Fork, then `pnpm install`
2. Branch, change, run `pnpm validate && pnpm test`
3. Add a changeset (`pnpm changeset`) for package changes
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/), open a PR

Guides: [`docs/PACKAGE-GUIDELINES.md`](docs/PACKAGE-GUIDELINES.md) · [`docs/PUBLISHING-GUIDELINES.md`](docs/PUBLISHING-GUIDELINES.md) · [`AGENTS.md`](AGENTS.md)

- 🐛 [Report a bug](https://github.com/jmlweb/tooling/issues/new?labels=bug)
- 💡 [Request a feature](https://github.com/jmlweb/tooling/issues/new?labels=enhancement)
- 🔒 Security issues: use GitHub [private vulnerability reporting](https://github.com/jmlweb/tooling/security/advisories/new), not public issues

## 📄 License

MIT
