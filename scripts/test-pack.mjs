#!/usr/bin/env node

/**
 * Test Pack Script
 *
 * Validates packages are ready for publishing by packing them and
 * validating the tarball contents.
 *
 * Validation checks:
 * - Packages without dist/ folder are skipped (not built in filtered PRs)
 * - Each package is packed using pnpm pack
 * - Tarball contents are validated:
 *   - package.json exists
 *   - dist/ exists (for packages with build scripts)
 *   - No unresolved workspace:* references
 *
 * Usage:
 *   node scripts/test-pack.mjs
 *
 * Note: Packages must be built before running this script.
 *
 * Exit codes:
 *   0 - All packages validated successfully
 *   1 - One or more packages failed validation
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const packagesDir = join(rootDir, 'packages');
const packedDir = join(rootDir, 'packed');

/**
 * Execute command quietly
 * @param {string} cmd - Command to execute
 * @param {object} options - Additional exec options
 */
function exec(cmd, options = {}) {
  execSync(cmd, {
    encoding: 'utf-8',
    stdio: 'inherit',
    ...options,
  });
}

/**
 * Read package.json from a directory
 * @param {string} dir - Directory path
 * @returns {object|null} Parsed package.json or null if not found
 */
function readPackageJson(dir) {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) {
    return null;
  }
  return JSON.parse(readFileSync(pkgPath, 'utf-8'));
}

/**
 * Check if package has a build script
 * @param {object} packageJson - Parsed package.json
 * @returns {boolean}
 */
function hasBuildScript(packageJson) {
  return !!(packageJson.scripts && packageJson.scripts.build);
}

/**
 * Validate a single package
 * @param {string} pkgDir - Package directory path
 * @returns {boolean} true if validation passed, false otherwise
 */
function validatePackage(pkgDir) {
  const packageJson = readPackageJson(pkgDir);
  if (!packageJson) {
    console.log(`::error file=${pkgDir}/package.json::package.json not found`);
    return false;
  }

  const pkgName = packageJson.name;
  const pkgDirName = pkgDir.split('/').pop();

  // Skip packages that weren't built (no dist folder)
  // This happens in PRs when filtering is used
  if (!existsSync(join(pkgDir, 'dist'))) {
    if (hasBuildScript(packageJson)) {
      console.log(
        `⚠️  Skipping ${pkgName} - no dist folder (not built in this run)`,
      );
      return null; // null = skipped, not failed
    } else {
      console.log(`⏭️  Skipping ${pkgName} - no build script`);
      return null; // null = skipped, not failed
    }
  }

  console.log(`\n=== Packing ${pkgName} ===`);

  let passed = true;

  try {
    // Pack the package
    exec(`pnpm pack --pack-destination "${packedDir}"`, {
      cwd: pkgDir,
      stdio: 'pipe', // Suppress pack output
    });

    // Find the created tarball
    const tarballs = readdirSync(packedDir).filter(
      (file) => file.endsWith('.tgz') && file.includes(pkgDirName),
    );

    if (tarballs.length === 0) {
      console.log(
        `::error file=${pkgDir}/package.json::Failed to create tarball for ${pkgName}`,
      );
      return false;
    }

    const tarball = join(packedDir, tarballs[0]);
    console.log(`📦 Created: ${tarballs[0]}`);

    // Extract tarball for validation
    const validateDir = join(rootDir, `validate-${pkgDirName}`);
    mkdirSync(validateDir, { recursive: true });

    exec(`tar -xzf "${tarball}" -C "${validateDir}"`, { stdio: 'pipe' });

    const extractedPkgDir = join(validateDir, 'package');

    // Check package.json exists in tarball
    if (!existsSync(join(extractedPkgDir, 'package.json'))) {
      console.log(
        `::error file=${pkgDir}/package.json::package.json missing in tarball for ${pkgName}`,
      );
      passed = false;
    }

    // For packages with build output, check dist exists
    if (hasBuildScript(packageJson)) {
      if (!existsSync(join(extractedPkgDir, 'dist'))) {
        console.log(
          `::error file=${pkgDir}/package.json::dist folder missing in tarball for ${pkgName}`,
        );
        passed = false;
      }
    }

    // Check for unresolved workspace:* references
    const tarballPkgJson = readPackageJson(extractedPkgDir);
    if (tarballPkgJson) {
      const pkgJsonStr = JSON.stringify(tarballPkgJson);
      if (pkgJsonStr.includes('"workspace:*"')) {
        console.log(
          `::error file=${pkgDir}/package.json::Unresolved workspace:* reference in ${pkgName}`,
        );
        passed = false;
      }
    }

    // Show tarball contents for debugging
    console.log(`Contents of ${pkgName}:`);
    exec(`ls -la "${extractedPkgDir}"`, { stdio: 'inherit' });

    if (passed) {
      console.log(`✅ ${pkgName} validated successfully`);
    }
  } catch (error) {
    console.log(
      `::error file=${pkgDir}/package.json::Failed to pack or validate ${pkgName}: ${error.message}`,
    );
    passed = false;
  }

  return passed;
}

/**
 * Main function
 */
function main() {
  console.log('📦 Packing and validating packages...\n');

  // Create packed directory
  mkdirSync(packedDir, { recursive: true });

  // Get all package directories
  const packageDirs = readdirSync(packagesDir)
    .map((entry) => join(packagesDir, entry))
    .filter((path) => {
      try {
        return (
          readdirSync(path).includes('package.json') &&
          existsSync(join(path, 'package.json'))
        );
      } catch {
        return false;
      }
    });

  let validatedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const pkgDir of packageDirs) {
    const result = validatePackage(pkgDir);

    if (result === null) {
      // Skipped
      skippedCount++;
    } else if (result === true) {
      // Passed
      validatedCount++;
    } else {
      // Failed
      failedCount++;
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('PACK VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Validated: ${validatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Failed: ${failedCount}`);

  if (failedCount > 0) {
    console.log(
      '\n::error title=Pack Validation Failed::One or more packages failed pack validation.',
    );
    console.log('\n❌ Pack validation failed!');
    process.exit(1);
  }

  console.log(`\n✅ Validated ${validatedCount} package(s) successfully`);
  process.exit(0);
}

main();
