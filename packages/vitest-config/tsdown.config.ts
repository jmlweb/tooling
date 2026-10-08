import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  deps: {
    // `vite` appears in the emitted types through vitest's `UserConfig`
    neverBundle: ['vitest', 'vite'],
  },
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  sourcemap: false,
  target: false,
  cjsDefault: false,
});
