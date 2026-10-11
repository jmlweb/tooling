# 🧪 Apps

Private apps that document, demo and validate the `@jmlweb/*` packages. None are published.

| App                                                                 | Purpose                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`docs/`](./docs)                                                   | 📚 Astro Starlight docs site ([jmlweb.github.io/tooling](https://jmlweb.github.io/tooling/)) |
| [`test-app/`](./test-app)                                           | 🧪 Smoke tests for the Prettier, ESLint and tsconfig packages (maintenance mode)             |
| [`integration-tests/`](./integration-tests)                         | 📦 Packs, installs and runs every package like a consumer                                    |
| [`example-nodejs-typescript-api/`](./example-nodejs-typescript-api) | 🟢 Express + TypeScript with Oxfmt, Oxlint, Vitest                                           |
| [`example-react-typescript-app/`](./example-react-typescript-app)   | ⚛️ React 19 + Tailwind 4 + Vite with Oxfmt, Oxlint, Vitest                                   |
| [`example-nodejs-javascript/`](./example-nodejs-javascript)         | 🟨 Express in plain JavaScript with Oxfmt, Oxlint                                            |

## 🚀 Commands

Run from the repo root.

| Command                                        | Runs                                             |
| ---------------------------------------------- | ------------------------------------------------ |
| `pnpm dev:docs` / `pnpm docs:build`            | Docs site dev server / build                     |
| `pnpm --filter @jmlweb/test-app test`          | All `test-app` checks (`test:*` runs one)        |
| `pnpm --filter @jmlweb/integration-tests test` | Integration suite                                |
| `pnpm --filter <example> <script>`             | Example script (`lint`, `format`, `test`, `dev`) |

`<example>` is the package name: `nodejs-typescript-api-example`, `react-typescript-app-example` or `nodejs-javascript-example`.

## 📝 Notes

- `docs` also has `generate:docs` (generates site content from package READMEs).
- `test-app` scripts: `test:prettier-base`, `test:prettier-tailwind`, `test:eslint-js`, `test:eslint-ts`, `test:tsconfig`.
- Keep examples on the latest package versions; update them with any package change.
