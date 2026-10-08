import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  deps: {
    neverBundle: [
      '@jmlweb/eslint-config-base',
      '@eslint/js',
      'eslint',
      'eslint-config-prettier',
      '@eslint-react/eslint-plugin',
      '@stylistic/eslint-plugin',
      'eslint-plugin-perfectionist',
      'eslint-plugin-react-hooks',
      'eslint-plugin-simple-import-sort',
      'typescript-eslint',
    ],
  },
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  sourcemap: false,
  target: false,
  cjsDefault: false,
});
