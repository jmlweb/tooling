#!/usr/bin/env node

/**
 * Validate all packages in the monorepo.
 *
 * This script iterates through all packages in the packages/ directory
 * and validates each one using the validate-package.mjs script.
 *
 * Usage:
 *   node scripts/validate-all-packages.mjs
 *
 * Exit codes:
 *   0 - All packages valid
 *   1 - One or more packages failed validation
 */

import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const packagesDir = join(rootDir, 'packages');
const validateScript = join(__dirname, 'validate-package.mjs');

/**
 * Get all package directories
 * @returns {string[]} Array of package directory paths
 */
function getPackageDirectories() {
  const entries = readdirSync(packagesDir);
  const packageDirs = [];

  for (const entry of entries) {
    const entryPath = join(packagesDir, entry);
    const stat = statSync(entryPath);

    if (stat.isDirectory()) {
      packageDirs.push(entryPath);
    }
  }

  return packageDirs;
}

/**
 * Validate a single package
 * @param {string} packageDir - Path to package directory
 * @returns {boolean} true if validation passed, false otherwise
 */
function validatePackage(packageDir) {
  try {
    execSync(`node ${validateScript} ${packageDir}`, {
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log('📦 Validating all packages in monorepo...\n');

  const packageDirs = getPackageDirectories();
  console.log(`Found ${packageDirs.length} package(s)\n`);

  let passedCount = 0;
  let failedCount = 0;
  const failedPackages = [];

  for (const packageDir of packageDirs) {
    const packageName = packageDir.split('/').pop();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Validating: ${packageName}`);
    console.log('='.repeat(60));

    const passed = validatePackage(packageDir);

    if (passed) {
      passedCount++;
      console.log(`✅ ${packageName} passed validation`);
    } else {
      failedCount++;
      failedPackages.push(packageName);
      console.log(`❌ ${packageName} failed validation`);
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total packages: ${packageDirs.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);

  if (failedCount > 0) {
    console.log('\nFailed packages:');
    for (const pkg of failedPackages) {
      console.log(`  - ${pkg}`);
    }
    console.log('\n❌ Validation failed!');
    process.exit(1);
  }

  console.log('\n✅ All packages validated successfully!');
  process.exit(0);
}

main();
