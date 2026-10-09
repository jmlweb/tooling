---
'@jmlweb/oxlint-config-node': minor
---

Add `@jmlweb/oxlint-config-node`, an Oxlint configuration that extends `@jmlweb/oxlint-config-base` and ports `@jmlweb/eslint-config-node`. It runs `eslint-plugin-n`'s `flat/recommended` rules and the same best-practice rules as a JS plugin, uses Oxlint's native `node/*` rules where they exist, and sets Node.js globals for JavaScript and TypeScript files. The naming convention rule is not ported.
