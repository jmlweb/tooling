---
'@jmlweb/eslint-config-base': patch
---

Disable explicit-function-return-type rule by default

This rule was too strict for utility libraries and functional programming patterns where return types can be inferred. Projects that want stricter enforcement can re-enable it in their own eslint.config.js.
