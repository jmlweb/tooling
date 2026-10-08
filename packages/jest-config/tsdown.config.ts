import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  external: ['jest', 'ts-jest', '@types/jest'],
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  options: {
    sourcemap: false,
    target: false,
    cjsDefault: false,
  },
});
