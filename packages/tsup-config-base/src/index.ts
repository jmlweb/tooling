import type { Options } from 'tsup';

/**
 * Entry points configuration - can be an array of paths or an object mapping names to paths
 */
export type EntryConfig = string[] | Record<string, string>;

/**
 * Node.js target version for CLI builds
 */
export type NodeTarget =
  | 'node16'
  | 'node18'
  | 'node20'
  | 'node22'
  | `node${number}`;

/**
 * Options for creating a base tsup configuration
 */
export interface TsupConfigOptions {
  /**
   * Entry points for the build
   * Can be an array of paths or an object mapping output names to source paths
   * @default ['src/index.ts']
   * @example
   * ```typescript
   * // Array format
   * entry: ['src/index.ts', 'src/cli.ts']
   *
   * // Object format (named entries)
   * entry: { index: 'src/index.ts', cli: 'src/cli.ts' }
   * ```
   */
  entry?: EntryConfig;

  /**
   * Output formats
   * @default ['cjs', 'esm']
   */
  format?: ('cjs' | 'esm' | 'iife')[];

  /**
   * Generate TypeScript declaration files
   * @default true
   */
  dts?: boolean;

  /**
   * Clean output directory before build
   * @default true
   */
  clean?: boolean;

  /**
   * Output directory
   * @default 'dist'
   */
  outDir?: string;

  /**
   * External packages to exclude from the bundle
   * Typically includes peer dependencies and internal workspace packages
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Additional tsup options to merge with the base configuration
   */
  options?: Omit<
    Options,
    'entry' | 'format' | 'dts' | 'clean' | 'outDir' | 'external'
  >;
}

/**
 * Options for creating a CLI-specific tsup configuration
 */
export interface TsupCliConfigOptions {
  /**
   * Entry points for the build
   * Can be an array of paths or an object mapping output names to source paths
   * @default { cli: 'src/cli.ts' }
   * @example
   * ```typescript
   * // Single CLI entry
   * entry: { cli: 'src/cli.ts' }
   *
   * // CLI with library API
   * entry: { cli: 'src/cli.ts', index: 'src/index.ts' }
   *
   * // Array format
   * entry: ['src/cli.ts', 'src/index.ts']
   * ```
   */
  entry?: EntryConfig;

  /**
   * Output formats
   * @default ['esm']
   */
  format?: ('cjs' | 'esm' | 'iife')[];

  /**
   * Generate TypeScript declaration files
   * @default true
   */
  dts?: boolean;

  /**
   * Clean output directory before build
   * @default true
   */
  clean?: boolean;

  /**
   * Output directory
   * @default 'dist'
   */
  outDir?: string;

  /**
   * External packages to exclude from the bundle
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Node.js target version for the build
   * @default 'node18'
   */
  target?: NodeTarget;

  /**
   * Add shebang (#!/usr/bin/env node) to the output
   * When true, adds shebang to all entry points
   * When a string or array, only adds shebang to matching entry names
   * @default true
   * @example
   * ```typescript
   * // Add shebang to all entries
   * shebang: true
   *
   * // Add shebang only to 'cli' entry
   * shebang: 'cli'
   *
   * // Add shebang to specific entries
   * shebang: ['cli', 'bin']
   * ```
   */
  shebang?: boolean | string | string[];

  /**
   * Additional tsup options to merge with the base configuration
   */
  options?: Omit<
    Options,
    'entry' | 'format' | 'dts' | 'clean' | 'outDir' | 'external' | 'target'
  >;
}

/**
 * Base tsup configuration defaults used across all @jmlweb packages
 */
const BASE_DEFAULTS = {
  entry: ['src/index.ts'] as EntryConfig,
  format: ['cjs', 'esm'] as ('cjs' | 'esm')[],
  dts: true,
  clean: true,
  outDir: 'dist',
} satisfies Partial<Options>;

/**
 * CLI-specific tsup configuration defaults
 */
const CLI_DEFAULTS = {
  entry: { cli: 'src/cli.ts' } as EntryConfig,
  format: ['esm'] as ('esm')[],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'node18' as NodeTarget,
  shebang: true as boolean | string | string[],
} satisfies Partial<Options> & { target: NodeTarget; shebang: boolean | string | string[] };

/**
 * Creates a base tsup configuration with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage without externals
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig();
 * ```
 *
 * @example
 * ```typescript
 * // With external dependencies
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig({
 *   external: ['eslint', 'typescript-eslint', '@eslint/js'],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With additional options
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig({
 *   external: ['vitest'],
 *   options: {
 *     minify: true,
 *     sourcemap: true,
 *   },
 * });
 * ```
 */
export const createTsupConfig = (config: TsupConfigOptions = {}): Options => {
  const {
    entry = BASE_DEFAULTS.entry,
    format = BASE_DEFAULTS.format,
    dts = BASE_DEFAULTS.dts,
    clean = BASE_DEFAULTS.clean,
    outDir = BASE_DEFAULTS.outDir,
    external = [],
    options = {},
  } = config;

  return {
    entry,
    format,
    dts,
    clean,
    outDir,
    ...(external.length > 0 && { external }),
    ...options,
  };
};

/**
 * Shebang line for Node.js CLI executables
 */
const SHEBANG = '#!/usr/bin/env node';

/**
 * Creates a CLI-specific tsup configuration with shebang support
 *
 * This preset is optimized for CLI packages with:
 * - ESM-only output by default
 * - Automatic shebang injection
 * - Node.js target specification
 * - Support for object-style entry points
 *
 * @example
 * ```typescript
 * // Simple CLI with shebang
 * import { createTsupCliConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupCliConfig();
 * ```
 *
 * @example
 * ```typescript
 * // CLI with library API (shebang only on cli entry)
 * import { createTsupCliConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupCliConfig({
 *   entry: { cli: 'src/cli.ts', index: 'src/index.ts' },
 *   shebang: 'cli', // Only add shebang to cli entry
 * });
 * ```
 *
 * @example
 * ```typescript
 * // CLI targeting Node.js 22
 * import { createTsupCliConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupCliConfig({
 *   target: 'node22',
 *   external: ['commander'],
 * });
 * ```
 */
export const createTsupCliConfig = (
  config: TsupCliConfigOptions = {},
): Options | Options[] => {
  const {
    entry = CLI_DEFAULTS.entry,
    format = CLI_DEFAULTS.format,
    dts = CLI_DEFAULTS.dts,
    clean = CLI_DEFAULTS.clean,
    outDir = CLI_DEFAULTS.outDir,
    external = [],
    target = CLI_DEFAULTS.target,
    shebang = CLI_DEFAULTS.shebang,
    options = {},
  } = config;

  // Normalize shebang to array of entry names
  const shebangEntries = normalizeShebangConfig(shebang);

  // If shebang applies to all entries, use simple banner config
  if (shebangEntries === 'all') {
    return {
      entry,
      format,
      dts,
      clean,
      outDir,
      target,
      banner: { js: SHEBANG },
      ...(external.length > 0 && { external }),
      ...options,
    };
  }

  // If no shebang needed, return simple config
  if (shebangEntries.length === 0) {
    return {
      entry,
      format,
      dts,
      clean,
      outDir,
      target,
      ...(external.length > 0 && { external }),
      ...options,
    };
  }

  // For selective shebang, we need to split into multiple configs
  const entryObject = normalizeEntry(entry);
  const shebangSet = new Set(shebangEntries);

  const withShebang: Record<string, string> = {};
  const withoutShebang: Record<string, string> = {};

  for (const [name, path] of Object.entries(entryObject)) {
    if (shebangSet.has(name)) {
      withShebang[name] = path;
    } else {
      withoutShebang[name] = path;
    }
  }

  const configs: Options[] = [];

  // Config for entries with shebang
  if (Object.keys(withShebang).length > 0) {
    configs.push({
      entry: withShebang,
      format,
      dts,
      clean,
      outDir,
      target,
      banner: { js: SHEBANG },
      ...(external.length > 0 && { external }),
      ...options,
    });
  }

  // Config for entries without shebang
  if (Object.keys(withoutShebang).length > 0) {
    configs.push({
      entry: withoutShebang,
      format,
      dts,
      // Only clean on first config
      clean: configs.length === 0 ? clean : false,
      outDir,
      target,
      ...(external.length > 0 && { external }),
      ...options,
    });
  }

  return configs.length === 1 ? configs[0] : configs;
};

/**
 * Normalize entry to object format
 */
const normalizeEntry = (entry: EntryConfig): Record<string, string> => {
  if (Array.isArray(entry)) {
    return entry.reduce(
      (acc, path) => {
        // Extract name from path (e.g., 'src/cli.ts' -> 'cli')
        const name = path.replace(/^.*\//, '').replace(/\.[^.]+$/, '');
        acc[name] = path;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
  return entry;
};

/**
 * Normalize shebang config to determine which entries need shebang
 * Returns 'all' if all entries need shebang, or array of entry names
 */
const normalizeShebangConfig = (
  shebang: boolean | string | string[],
): 'all' | string[] => {
  if (shebang === true) {
    return 'all';
  }
  if (shebang === false) {
    return [];
  }
  if (typeof shebang === 'string') {
    return [shebang];
  }
  return shebang;
};

/**
 * Re-export the base defaults for reference
 */
export { BASE_DEFAULTS, CLI_DEFAULTS };

/**
 * Re-export tsup's Options type for convenience
 */
export type { Options } from 'tsup';
