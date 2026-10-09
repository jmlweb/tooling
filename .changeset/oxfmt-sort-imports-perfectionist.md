---
'@jmlweb/oxfmt-config-base': minor
---

Enable `sortImports` with `eslint-plugin-perfectionist`'s default `sort-imports` groups. Oxfmt already shares Perfectionist's other defaults, so imports are now sorted in the same order. Set `sortImports: false` in projects whose imports are still sorted by ESLint.
