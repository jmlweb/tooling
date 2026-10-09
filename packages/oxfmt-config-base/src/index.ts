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
  // Oxfmt already shares eslint-plugin-perfectionist's other sort-imports defaults;
  // only its default groups differ
  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
};

export default config;
