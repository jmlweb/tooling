import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  deps: {
    // `@commitlint/types` is a type-only devDependency referenced by the emitted types
    neverBundle: ['@commitlint/config-conventional', '@commitlint/types'],
    skipNodeModulesBundle: true,
  },
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  sourcemap: false,
  target: false,
  cjsDefault: false,
});
