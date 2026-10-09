import { createTsdownConfig } from '@jmlweb/tsdown-config-base';

export default createTsdownConfig({
  entry: ['src/index.ts', 'src/plugin.ts'],
  // Same output shape as the other config packages:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  sourcemap: false,
  target: false,
  cjsDefault: false,
});
