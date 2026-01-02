/**
 * Package validation script for pre-publish checks.
 *
 * Validates:
 * - Required package.json fields
 * - Name format (@jmlweb/ pattern)
 * - Version format (semver)
 * - File existence (files field)
 * - README.md exists
 * - Exports structure
 * - Repository structure
 *
 * Usage:
 *   node scripts/validate-package.mjs [package-path]
 *
 * If no package-path is provided, validates the current directory.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Log an error with optional GitHub Actions annotation
 * @param {string} message - Error message
 * @param {string} file - File path for annotation (optional)
 * @returns {string} The error message
 */
function logError(message, file = null) {
  if (process.env.GITHUB_ACTIONS && file) {
    console.log(`::error file=${file}::${message}`);
  }
  return message;
}

/**
 * Log a warning with optional GitHub Actions annotation
 * @param {string} message - Warning message
 * @param {string} file - File path for annotation (optional)
 * @returns {string} The warning message
 */
function logWarning(message, file = null) {
  if (process.env.GITHUB_ACTIONS && file) {
    console.log(`::warning file=${file}::${message}`);
  }
  return message;
}

const REQUIRED_FIELDS = [
  'name',
  'version',
  'description',
  'main',
  'exports',
  'files',
  'author',
  'license',
  'repository',
];

/**
 * Checks if this is a config-only package (exports JSON, not JS/TS)
 * @param {object} packageJson
 * @returns {boolean}
 */
function isConfigOnlyPackage(packageJson) {
  // If main points to a JSON file, it's a config package
  if (packageJson.main && packageJson.main.endsWith('.json')) {
    return true;
  }
  return false;
}

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * @typedef {object} ValidationResult
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * Validates a package.json file
 * @param {string} packageDir - Path to the package directory
 * @returns {ValidationResult}
 */
function validatePackage(packageDir) {
  const errors = [];
  const warnings = [];

  const packageJsonPath = join(packageDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    errors.push(
      logError(`package.json not found at ${packageJsonPath}`, packageJsonPath),
    );
    return { errors, warnings };
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const isConfigPkg = isConfigOnlyPackage(packageJson);

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!packageJson[field]) {
      errors.push(
        logError(`Missing required field: ${field}`, packageJsonPath),
      );
    }
  }

  // types is only required for non-config packages
  if (!isConfigPkg && !packageJson.types) {
    errors.push(logError('Missing required field: types', packageJsonPath));
  }

  // Validate name format
  if (packageJson.name && !packageJson.name.startsWith('@jmlweb/')) {
    errors.push(
      logError(
        `Package name must start with @jmlweb/, got: ${packageJson.name}`,
        packageJsonPath,
      ),
    );
  }

  // Validate version format
  if (packageJson.version && !SEMVER_REGEX.test(packageJson.version)) {
    errors.push(
      logError(
        `Invalid semver version: ${packageJson.version}`,
        packageJsonPath,
      ),
    );
  }

  // Check README exists
  const readmePath = join(packageDir, 'README.md');
  if (!existsSync(readmePath)) {
    warnings.push(logWarning('README.md not found', readmePath));
  }

  // Validate exports structure
  if (packageJson.exports) {
    const mainExport = packageJson.exports['.'];
    if (!mainExport) {
      errors.push(logError('exports["."] is required', packageJsonPath));
    } else if (!isConfigPkg) {
      // Only require import/require for non-config packages
      if (typeof mainExport === 'string') {
        errors.push(
          logError(
            'exports["."] should be an object with import/require fields',
            packageJsonPath,
          ),
        );
      } else {
        if (!mainExport.import) {
          errors.push(
            logError('exports["."].import is required', packageJsonPath),
          );
        }
        if (!mainExport.require) {
          errors.push(
            logError('exports["."].require is required', packageJsonPath),
          );
        }
      }
    }
    // Config packages can use simple string exports like "./tsconfig.json"
  }

  // Validate repository structure - must be object with type and full URL
  if (packageJson.repository) {
    if (typeof packageJson.repository === 'string') {
      errors.push(
        logError(
          'repository must be an object with "type" and "url" fields, not a string. ' +
            `Got: "${packageJson.repository}". ` +
            'Use format: { "type": "git", "url": "https://github.com/jmlweb/tooling.git" }',
          packageJsonPath,
        ),
      );
    } else if (typeof packageJson.repository === 'object') {
      if (!packageJson.repository.type) {
        errors.push(
          logError(
            'repository.type is required (e.g., "git")',
            packageJsonPath,
          ),
        );
      }
      if (!packageJson.repository.url) {
        errors.push(
          logError(
            'repository.url is required (e.g., "https://github.com/jmlweb/tooling.git")',
            packageJsonPath,
          ),
        );
      } else {
        // Validate URL format - should be a full URL, not shorthand
        const url = packageJson.repository.url;
        if (!url.startsWith('https://') && !url.startsWith('git://')) {
          errors.push(
            logError(
              `repository.url must be a full URL starting with https:// or git://. ` +
                `Got: "${url}". ` +
                'Use format: "https://github.com/jmlweb/tooling.git"',
              packageJsonPath,
            ),
          );
        }
      }
    }
  }

  // Check files field entries (warnings only - they may be generated by build)
  if (packageJson.files && Array.isArray(packageJson.files)) {
    for (const file of packageJson.files) {
      const filePath = join(packageDir, file);
      if (!existsSync(filePath)) {
        // This is a warning since files might be generated by the build step
        warnings.push(
          logWarning(
            `File in "files" field not found (may be generated): ${file}`,
            filePath,
          ),
        );
      }
    }
  }

  return { errors, warnings };
}

/**
 * Main function
 */
function main() {
  // Determine package directory
  let packageDir = process.cwd();

  // If a path argument is provided, use it
  if (process.argv[2]) {
    packageDir = resolve(process.argv[2]);
  }

  console.log(`Validating package at: ${packageDir}\n`);

  const { errors, warnings } = validatePackage(packageDir);

  // Print warnings
  if (warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
    console.log();
  }

  // Print errors
  if (errors.length > 0) {
    console.log('Errors:');
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
    console.log();
    console.log('Validation failed!');
    process.exit(1);
  }

  console.log('Validation passed!');
}

main();
