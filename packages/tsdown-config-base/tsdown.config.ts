// Built with its own source: the package cannot depend on its unbuilt dist
import { createTsdownConfig } from './src/index.ts';

export default createTsdownConfig({
  deps: {
    neverBundle: ['tsdown'],
  },
  // Keep the published output identical to the previous tsup build:
  // no sourcemaps, no syntax lowering and `exports.default` in CJS
  dts: { sourcemap: false },
  sourcemap: false,
  target: false,
  cjsDefault: false,
});
