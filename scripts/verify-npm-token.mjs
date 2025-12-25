#!/usr/bin/env node

/**
 * Script to verify NPM_TOKEN is valid and has correct permissions.
 *
 * Usage:
 *   NPM_TOKEN="your_token" node scripts/verify-npm-token.mjs
 *   # or
 *   node scripts/verify-npm-token.mjs --token "your_token"
 */

import https from 'node:https';

const token =
  process.env.NPM_TOKEN ||
  process.argv.find((arg) => arg.startsWith('--token='))?.split('=')[1];

if (!token) {
  console.error('❌ NPM_TOKEN not provided');
  console.error('');
  console.error('Usage:');
  console.error('  NPM_TOKEN="your_token" node scripts/verify-npm-token.mjs');
  console.error('  node scripts/verify-npm-token.mjs --token="your_token"');
  process.exit(1);
}

console.log('🔍 Verifying NPM token...\n');

// Step 1: Verify token is valid
const verifyToken = () =>
  new Promise((resolve, reject) => {
    const req = https.get(
      'https://registry.npmjs.org/-/npm/v1/user',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else if (res.statusCode === 401) {
            reject(new Error('Token is invalid or expired'));
          } else {
            reject(new Error(`Unexpected status: ${res.statusCode}`));
          }
        });
      },
    );
    req.on('error', reject);
  });

// Step 2: Check token type and permissions
const checkTokenInfo = () =>
  new Promise((resolve, reject) => {
    const req = https.get(
      'https://registry.npmjs.org/-/npm/v1/tokens',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            // Token info might not be accessible with all token types
            resolve(null);
          }
        });
      },
    );
    req.on('error', () => resolve(null));
  });

// Step 3: Check if we can access @jmlweb scope
const checkScopeAccess = () =>
  new Promise((resolve) => {
    const req = https.get(
      'https://registry.npmjs.org/-/org/jmlweb/package',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 404);
      },
    );
    req.on('error', () => resolve(false));
  });

async function main() {
  try {
    // Verify token
    const user = await verifyToken();
    console.log(`✅ Token is valid`);
    console.log(`   User: ${user.name}`);
    if (user.email) {
      console.log(`   Email: ${user.email}`);
    }
    console.log('');

    // Check token info
    const tokenInfo = await checkTokenInfo();
    if (tokenInfo?.objects?.length > 0) {
      console.log('📋 Token details:');
      const currentToken = tokenInfo.objects.find(
        (t) => t.token === token.slice(0, 6) + '...',
      );
      if (currentToken) {
        console.log(`   Type: ${currentToken.type || 'unknown'}`);
        console.log(`   Created: ${currentToken.created || 'unknown'}`);
        if (currentToken.cidr_whitelist?.length > 0) {
          console.log(
            `   CIDR Whitelist: ${currentToken.cidr_whitelist.join(', ')}`,
          );
        }
      }
      console.log('');
    }

    // Check scope access
    const hasScope = await checkScopeAccess();
    if (hasScope) {
      console.log('✅ Can access @jmlweb scope');
    } else {
      console.log(
        '⚠️  Could not verify @jmlweb scope access (this is normal for new scopes)',
      );
    }
    console.log('');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Token verification successful!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Add this token to GitHub Secrets as NPM_TOKEN');
    console.log(
      '2. Go to: https://github.com/<owner>/<repo>/settings/secrets/actions',
    );
    console.log('3. Click "New repository secret"');
    console.log('4. Name: NPM_TOKEN, Value: <your token>');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Token verification failed: ${error.message}`);
    console.error('');
    console.error('Common issues:');
    console.error('- Token may be expired');
    console.error('- Token may not have publish permissions');
    console.error('- Token may be restricted to specific IPs');
    console.error('');
    console.error('To create a new token:');
    console.error('1. Go to https://www.npmjs.com/settings/<username>/tokens');
    console.error('2. Click "Generate New Token" > "Granular Access Token"');
    console.error('3. Set permissions: Read and Write for @jmlweb scope');
    process.exit(1);
  }
}

main();
