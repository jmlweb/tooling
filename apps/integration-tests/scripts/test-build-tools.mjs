#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
  importFromTestEnv,
  initTestProject,
  installDependencies,
} from './utils.mjs';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => {
    console.log(chalk.red('✗'), msg);
    throw new Error(msg);
  },
  section: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
};

export async function testBuildToolConfigs(packages) {
  log.section('Testing Build Tool Config Packages');

  const buildToolPackages = packages.filter(
    (pkg) =>
      pkg.name.includes('tsup-config') ||
      pkg.name.includes('vite-config') ||
      pkg.name.includes('postcss-config'),
  );

  if (buildToolPackages.length === 0) {
    log.info('No build tool config packages found, skipping');
    return;
  }

  for (const pkg of buildToolPackages) {
    await testBuildToolPackage(pkg, packages);
  }
}

async function testBuildToolPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Determine dependencies based on package type
    const deps = {
      typescript: '^5.9.3',
    };

    if (pkg.name.includes('tsup-config')) {
      deps.tsup = '^8.5.1';
    } else if (pkg.name.includes('vite-config')) {
      deps.vite = '^6.0.0';
    } else if (pkg.name.includes('postcss-config')) {
      deps.postcss = '^8.4.49';
      deps['tailwindcss'] = '^3.4.17';
      deps.autoprefixer = '^10.4.20';
    }

    installDependencies(deps);

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const config = await importFromTestEnv(pkg.packageJson.name);
    if (!config) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config has expected structure
    log.info('Test 2: Verifying config structure...');

    if (pkg.name.includes('tsup-config')) {
      // tsup config can be: a config object, a function, or export factory functions
      // Note: importFromTestEnv serializes functions as '[Function]' strings
      const hasFactoryFunctions =
        config.createTsupConfig === '[Function]' ||
        config.createTsupCliConfig === '[Function]';
      const isConfigObject = config.entry || typeof config.entry === 'object';
      const isFunction = config === '[Function]';

      if (!hasFactoryFunctions && !isConfigObject && !isFunction) {
        throw new Error(
          'tsup config should have entry, be a function, or export factory functions',
        );
      }
      log.success('tsup config structure is valid');
    } else if (pkg.name.includes('vite-config')) {
      // Vite config structure check
      if (typeof config !== 'object' && typeof config !== 'function') {
        throw new Error('Vite config should be an object or function');
      }
      log.success('vite config structure is valid');
    } else if (pkg.name.includes('postcss-config')) {
      // PostCSS config should be an object with plugins
      if (typeof config !== 'object') {
        throw new Error('PostCSS config should be an object');
      }
      // PostCSS plugins can be an array or an object
      if (
        !config.plugins ||
        (typeof config.plugins !== 'object' && !Array.isArray(config.plugins))
      ) {
        throw new Error('PostCSS config should have a plugins property');
      }
      log.success('postcss config structure is valid');
    }

    // Test 3: Create a test config file that uses the package
    log.info('Test 3: Testing config file usage...');
    if (pkg.name.includes('tsup-config')) {
      // Check if package exports factory functions (serialized as '[Function]')
      const hasFactoryFunctions =
        config.createTsupConfig === '[Function]' ||
        config.createTsupCliConfig === '[Function]';

      if (hasFactoryFunctions) {
        // For factory function exports, create a config that calls the factory
        createTestFile(
          'tsup.config.ts',
          `import { createTsupConfig } from '${pkg.name}';

export default createTsupConfig({
  entry: ['src/index.ts'],
});
`,
        );
      } else {
        // For direct config exports, spread the config
        createTestFile(
          'tsup.config.ts',
          `import { defineConfig } from 'tsup';
import baseConfig from '${pkg.name}';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
});
`,
        );
      }
    } else if (pkg.name.includes('vite-config')) {
      createTestFile(
        'vite.config.ts',
        `import { defineConfig } from 'vite';
import baseConfig from '${pkg.name}';

export default defineConfig({
  ...baseConfig,
});
`,
      );
    } else if (pkg.name.includes('postcss-config')) {
      createTestFile(
        'postcss.config.js',
        `import baseConfig from '${pkg.name}';

export default baseConfig;
`,
      );
    }

    log.success('Config file structure is valid');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
