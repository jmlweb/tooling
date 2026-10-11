# 📦 Integration Tests

Verify packages work as consumers get them: packed to tarballs, installed in a temp project, then exercised.

## 🚀 Run

```bash
pnpm test --filter @jmlweb/integration-tests
```

Runs in CI (see [`docs/CI.md`](../../docs/CI.md)).

## 🔄 Flow

1. Pack all workspace packages
2. Create a temp project and install the tarballs
3. Run each suite
4. Clean up

## 🧪 Suites (`scripts/`)

| File                       | Covers                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `test-oxc.mjs`             | Oxfmt/Oxlint configs run on fixtures: output, native, type-aware and JS plugin rules |
| `test-prettier.mjs`        | Prettier configs                                                                     |
| `test-eslint.mjs`          | ESLint configs                                                                       |
| `test-tsconfig.mjs`        | TypeScript configs                                                                   |
| `test-testing-configs.mjs` | Vitest and Jest configs                                                              |
| `test-build-tools.mjs`     | tsup, tsdown (real build), Vite, PostCSS configs                                     |
| `test-commitlint.mjs`      | Commitlint config                                                                    |

`run-tests.mjs` is the entry point; `utils.mjs` holds shared helpers.
