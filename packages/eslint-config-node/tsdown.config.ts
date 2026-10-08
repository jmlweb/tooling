import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  external: [
    '@jmlweb/eslint-config-base',
    '@eslint/js',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-n',
    'eslint-plugin-simple-import-sort',
    'globals',
    'typescript-eslint',
  ],
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  options: {
    sourcemap: false,
    target: false,
    cjsDefault: false,
  },
});
