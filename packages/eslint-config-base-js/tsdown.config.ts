import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  options: {
    deps: {
      neverBundle: [
        '@eslint/js',
        'eslint',
        'eslint-config-prettier',
        'eslint-plugin-simple-import-sort',
      ],
    },
    sourcemap: false,
    target: false,
    cjsDefault: false,
  },
});
