---
'@jmlweb/oxlint-config-base': minor
---

Add `@jmlweb/oxlint-config-base`, an Oxlint configuration that ports `@jmlweb/eslint-config-base-js` and `@jmlweb/eslint-config-base`. It enables ESLint `recommended` equivalents for all files and typescript-eslint's `recommended`, `strict-type-checked` and `stylistic-type-checked` rules for TypeScript files, keeps the existing conventions (no `any`, `type` over `interface`, named exports only, no parameter mutation) and bundles a `jmlweb/no-enum` JS plugin rule. `naming-convention` and import sorting are not included.
