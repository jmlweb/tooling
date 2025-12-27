import prettierConfigModule from '@jmlweb/prettier-config-base';

// Extract the default export (the actual config object)
// Prettier needs the config object directly, not wrapped in { default: ... }
const config = prettierConfigModule.default || prettierConfigModule;

export default config;
