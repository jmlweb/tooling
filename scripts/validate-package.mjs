#!/usr/bin/env node

/**
 * Pre-publish validation script for packages
 * Validates package.json structure and required files before publishing
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get package directory from command line or use current directory
const packageDir = process.argv[2] || process.cwd();
const packageJsonPath = join(packageDir, 'package.json');

// Required fields in package.json
const REQUIRED_FIELDS = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'repository',
  'files',
];

// Optional but recommended fields
const RECOMMENDED_FIELDS = ['engines', 'keywords', 'bugs', 'homepage'];

function validatePackageJson() {
  console.log(`Validating package: ${packageDir}\n`);

  // Check if package.json exists
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    process.exit(1);
  }

  // Read and parse package.json
  let pkg;
  try {
    const content = readFileSync(packageJsonPath, 'utf-8');
    pkg = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to parse package.json:', error.message);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in pkg)) {
      errors.push(`Missing required field: ${field}`);
    } else if (
      pkg[field] === null ||
      pkg[field] === undefined ||
      pkg[field] === ''
    ) {
      errors.push(`Required field ${field} is empty`);
    }
  }

  // Check for private packages (shouldn't be published)
  if (pkg.private === true && pkg.publishConfig) {
    errors.push('Private packages should not have publishConfig');
  }

  // Validate name format (should start with @jmlweb/)
  if (pkg.name && !pkg.name.startsWith('@jmlweb/')) {
    errors.push(`Package name should start with @jmlweb/, got: ${pkg.name}`);
  }

  // Validate version format (semver)
  if (pkg.version) {
    const semverRegex = /^\d+\.\d+\.\d+(-.+)?$/;
    if (!semverRegex.test(pkg.version)) {
      errors.push(
        `Invalid version format: ${pkg.version}. Should follow semver (e.g., 1.0.0)`,
      );
    }
  }

  // Check if package has a build script (dist files will be created during build)
  const hasBuildScript = pkg.scripts && pkg.scripts.build;

  // Validate files field
  if (pkg.files && Array.isArray(pkg.files)) {
    for (const file of pkg.files) {
      const filePath = join(packageDir, file);
      // Allow dist directory/files to not exist if package has a build script
      // (they will be created during the build step)
      if (!existsSync(filePath)) {
        if (hasBuildScript && (file === 'dist' || file.startsWith('dist/'))) {
          // This is okay - dist will be created during build
          continue;
        }
        errors.push(`File listed in "files" field does not exist: ${file}`);
      }
    }
  } else if (pkg.files) {
    errors.push('"files" field must be an array');
  }

  // Check required files exist
  // All packages should have README.md
  const readmePath = join(packageDir, 'README.md');
  if (!existsSync(readmePath)) {
    errors.push('README.md is required but not found');
  }

  // Check main file exists (if specified)
  // Skip if it's in dist/ and package has a build script
  if (pkg.main) {
    const mainPath = join(packageDir, pkg.main);
    if (!existsSync(mainPath)) {
      if (hasBuildScript && pkg.main.includes('dist/')) {
        // This is okay - dist files will be created during build
      } else {
        errors.push(`Main file does not exist: ${pkg.main}`);
      }
    }
  }

  // Check module file exists (if specified)
  if (pkg.module) {
    const modulePath = join(packageDir, pkg.module);
    if (!existsSync(modulePath)) {
      if (hasBuildScript && pkg.module.includes('dist/')) {
        // This is okay - dist files will be created during build
      } else {
        errors.push(`Module file does not exist: ${pkg.module}`);
      }
    }
  }

  // Check types file exists (if specified)
  if (pkg.types) {
    const typesPath = join(packageDir, pkg.types);
    if (!existsSync(typesPath)) {
      if (hasBuildScript && pkg.types.includes('dist/')) {
        // This is okay - dist files will be created during build
      } else {
        errors.push(`Types file does not exist: ${pkg.types}`);
      }
    }
  }

  // Validate exports field structure (if present)
  if (pkg.exports) {
    if (typeof pkg.exports === 'object') {
      // Check exports structure
      if (pkg.exports['.']) {
        const exportEntry = pkg.exports['.'];
        if (exportEntry.require) {
          const requirePath =
            exportEntry.require.default || exportEntry.require;
          if (typeof requirePath === 'string') {
            const fullPath = join(packageDir, requirePath);
            if (!existsSync(fullPath)) {
              if (hasBuildScript && requirePath.includes('dist/')) {
                // This is okay - dist files will be created during build
              } else {
                errors.push(
                  `Export require path does not exist: ${requirePath}`,
                );
              }
            }
          }
        }
        if (exportEntry.import) {
          const importPath = exportEntry.import.default || exportEntry.import;
          if (typeof importPath === 'string') {
            const fullPath = join(packageDir, importPath);
            if (!existsSync(fullPath)) {
              if (hasBuildScript && importPath.includes('dist/')) {
                // This is okay - dist files will be created during build
              } else {
                errors.push(`Export import path does not exist: ${importPath}`);
              }
            }
          }
        }
      }
    }
  }

  // Check recommended fields
  for (const field of RECOMMENDED_FIELDS) {
    if (!(field in pkg)) {
      warnings.push(`Recommended field missing: ${field}`);
    }
  }

  // Validate repository structure
  if (pkg.repository) {
    if (typeof pkg.repository === 'string') {
      warnings.push('Repository should be an object with type and url');
    } else if (typeof pkg.repository === 'object') {
      if (!pkg.repository.type || !pkg.repository.url) {
        errors.push('Repository must have type and url');
      }
    }
  }

  // Validate engines.node (if present)
  if (pkg.engines && pkg.engines.node) {
    const nodeVersion = pkg.engines.node;
    if (!nodeVersion.startsWith('>=')) {
      warnings.push(
        'engines.node should specify minimum version (e.g., ">=18.0.0")',
      );
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach((warning) => console.log(`   - ${warning}`));
    console.log();
  }

  // Display errors and exit
  if (errors.length > 0) {
    console.error('❌ Validation failed:\n');
    errors.forEach((error) => console.error(`   - ${error}`));
    process.exit(1);
  }

  console.log('✅ Package validation passed\n');
}

// Run validation
try {
  validatePackageJson();
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
}
