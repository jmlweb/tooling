import type { OxfmtConfig } from 'oxfmt';

// Mirrors @jmlweb/prettier-config-base so both formatters produce the same output
const config: OxfmtConfig = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  endOfLine: 'lf',
  proseWrap: 'preserve',
  // Oxfmt defaults to 100; Prettier uses 80
  printWidth: 80,
  // Oxfmt sorts package.json by default; Prettier does not, and syncpack owns that order
  sortPackageJson: false,
};

export default config;
