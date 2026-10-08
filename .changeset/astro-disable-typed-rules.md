---
'@jmlweb/eslint-config-astro': patch
---

Disable type-checked `@typescript-eslint` rules for `.astro` files. The base config enables them globally but only provides `projectService` for `.ts`/`.tsx`, so linting any `.astro` file crashed with "You have used a rule which requires type information". Verified on ESLint 10.
