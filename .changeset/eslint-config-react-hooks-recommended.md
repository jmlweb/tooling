---
'@jmlweb/eslint-config-react': major
---

Use `eslint-plugin-react-hooks`' `recommended` preset instead of two hand-picked hooks rules.

- Enables the React Compiler rules (`purity`, `refs`, `immutability`, `set-state-in-effect`, `static-components`, ...), most of them as errors. They catch problems even without the React Compiler.
- Hooks rules now apply to every file, so custom hooks in `.ts` files are checked too.
- `@eslint-react`'s ports of these rules stay off, so each problem is reported once, as `react-hooks/*`.

Lower individual rules to `warn` while migrating; see the README migration guide.
