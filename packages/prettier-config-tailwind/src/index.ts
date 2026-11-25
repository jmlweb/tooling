import type { Config } from 'prettier';

import baseConfig from '@jmlweb/prettier-config-base';
import { createRequire } from 'node:module';

// Prettier resolves bare plugin names from the consumer project, where pnpm
// does not expose this package's dependencies. An absolute path resolved from
// here loads the plugin this package ships with
const requireFromThisPackage = createRequire(import.meta.url);
const tailwindPluginPath = requireFromThisPackage.resolve(
  'prettier-plugin-tailwindcss',
);

const config: Config = {
  ...baseConfig,
  plugins: [tailwindPluginPath],
};

export default config;
