---
id: RPT-010
title: eslint-config-base crashes on every .js/.mjs/.cjs file because type-checked presets are not scoped to TypeScript
type: bug
severity: high
status: triaged
created: 2026-11-21
triaged: 2026-11-21
task-id: TSK-010
---

## Summary

`@jmlweb/eslint-config-base` spreads `tseslint.configs.strictTypeChecked` and `stylisticTypeChecked` without a `files` restriction (`packages/eslint-config-base/src/index.ts:16-17`). `parserOptions.projectService` is only enabled for `**/*.ts` and `**/*.tsx` (`packages/eslint-config-base/src/index.ts:20-26`). Every JavaScript file therefore gets type-aware rules but no type information, and ESLint throws instead of linting it.

The README says JavaScript files get the `base-js` rules (`packages/eslint-config-base/README.md:102`), and the Quick Start (`packages/eslint-config-base/README.md:33-40`) is an `eslint.config.js`, which `eslint .` lints too. `@jmlweb/eslint-config-node` and `@jmlweb/eslint-config-react` spread this config, so they inherit the crash.

The repo's own `apps/test-app/eslint.config.mjs:8-11` works around it with `tseslint.configs.disableTypeChecked` for `**/*.mjs`, which the package never documents.

## Reproduction

Scratch project with a `tsconfig.json` (`include: ["**/*.ts"]`), `sum.ts` and `helper.js` (`export const greet = (name) => \`hi ${name}\`;`). Lint both with the built config via the ESLint Node API (`overrideConfigFile: true, overrideConfig: config`):

```text
sum.ts => 0 errors []
helper.js => THROWS Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file. ... Occurred while linting /tmp/eslprobe-Hv1N/helper.js
```

## Suggested fix

Scope the type-checked presets to TypeScript files (map them with `files: ['**/*.ts', '**/*.tsx']`), or append `{ ...tseslint.configs.disableTypeChecked, files: ['**/*.js', '**/*.mjs', '**/*.cjs'] }`. Add a regression test that lints a `.js` file with the built config, and drop the workaround from `apps/test-app/eslint.config.mjs`.
