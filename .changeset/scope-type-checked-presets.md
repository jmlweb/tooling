---
'@jmlweb/eslint-config-base': patch
---

Scope the `strictTypeChecked` and `stylisticTypeChecked` presets to `**/*.ts` and `**/*.tsx`. They previously applied to every file, so linting any `.js`, `.mjs` or `.cjs` file (including the consumer's own `eslint.config.js`) crashed with "You have used a rule which requires type information". JavaScript files now get the `@jmlweb/eslint-config-base-js` rules. `@jmlweb/eslint-config-node` and `@jmlweb/eslint-config-react` inherit the fix.
