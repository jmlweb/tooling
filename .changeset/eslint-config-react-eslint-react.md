---
'@jmlweb/eslint-config-react': major
---

Replace the unmaintained `eslint-plugin-react` with `@eslint-react/eslint-plugin` and support ESLint 10.

- React rules now come from `@eslint-react`'s `recommended-typescript` preset. Its ports of the hooks rules are turned off, so `eslint-plugin-react-hooks` stays the source of the hooks rules.
- Hooks rules now use `eslint-plugin-react-hooks`' `recommended` preset, which adds the React Compiler rules (`purity`, `refs`, `immutability`, `set-state-in-effect`, ...), and apply to every file, so custom hooks in `.ts` files are checked too.
- JSX style rules move to `@stylistic/eslint-plugin` (`jsx-pascal-case`, `jsx-self-closing-comp`, `jsx-curly-brace-presence`) and prop sorting to `eslint-plugin-perfectionist` (`sort-jsx-props`, same order as before).
- New peer dependencies: `@eslint-react/eslint-plugin`, `@stylistic/eslint-plugin`, `eslint-plugin-perfectionist`. `eslint-plugin-react` is no longer needed.
- `eslint` and `@eslint/js` peers now accept `^9.0.0 || ^10.0.0`.
- Rules caught by TypeScript (duplicate props, undefined components, string refs, missing `render` return) are dropped; `jsx-boolean-value`, `jsx-fragments` and `no-unescaped-entities` are no longer enforced.

See the README migration guide for the rule renames.
