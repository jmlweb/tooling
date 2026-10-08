---
'@jmlweb/eslint-config-base-js': minor
'@jmlweb/eslint-config-base': minor
'@jmlweb/eslint-config-node': minor
'@jmlweb/eslint-config-astro': minor
'@jmlweb/eslint-config-react': minor
---

Support ESLint 10 and align the peer dependency ranges across the ESLint configs.

- `@jmlweb/eslint-config-base-js`, `-base`, `-node` and `-astro`: `eslint` and `@eslint/js` peers are now `^9.0.0 || ^10.0.0`. ESLint 9 keeps working.
- `@jmlweb/eslint-config-node`: `globals` peer is now `^15.0.0 || ^16.0.0 || ^17.0.0` (was `^15.0.0`).
- `@jmlweb/eslint-config-node`, `-react` and `-astro`: `eslint-config-prettier` peer is now `^9.1.0 || ^10.0.0`, matching `-base` and `-base-js` (was `^9.1.0`).
- `@jmlweb/eslint-config-react`: still ESLint 9 only. `eslint-plugin-react` 7.37.5 does not support ESLint 10, and its `settings.react.version: 'detect'` crashes on it. Only the `eslint-config-prettier` peer range changed.
