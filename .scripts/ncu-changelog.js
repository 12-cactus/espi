#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Validates that a package name is safe (contains only valid npm package characters)
 */
function isValidPackageName(name) {
  // npm package names must be lowercase, can contain hyphens and underscores
  // This regex matches valid npm package names
  return /^(@?[a-z0-9]([a-z0-9-]*[a-z0-9])?\/)?[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(name);
}

/**
 * Fetches the repository URL for a given package
 */
function getRepoUrl(packageName) {
  try {
    // Validate package name to prevent command injection
    if (!isValidPackageName(packageName)) {
      return null;
    }

    const result = execSync(`npm view ${packageName} repository.url`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Converts git URLs to HTTPS GitHub URLs and attempts to link to changelog
 */
function formatChangelogUrl(repoUrl) {
  if (!repoUrl) return null;

  // Convert git:// or git+https:// to https://
  let url = repoUrl
    .replace('git+https://', 'https://')
    .replace('git://', 'https://')
    .replace('git@github.com:', 'https://github.com/')
    .replace(/\.git$/, '');

  // Try to link to releases page for GitHub repos
  if (url.includes('github.com')) {
    return `${url}/releases`;
  }

  return url;
}

/**
 * Safely reads package.json from the current working directory
 */
function readPackageJson() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');

  // Validate that the resolved path is within the current working directory
  // to prevent directory traversal attacks
  const resolvedPath = path.resolve(packageJsonPath);
  const resolvedCwd = path.resolve(cwd);

  if (!resolvedPath.startsWith(resolvedCwd)) {
    throw new Error('Invalid package.json path');
  }

  return JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
}

/**
 * Main function
 */
async function main() {
  try {
    // Read current package.json
    const packageJson = readPackageJson();
    const currentDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Run ncu and get JSON output
    const ncuOutput = execSync('ncu --jsonUpgraded', {
      encoding: 'utf-8',
    });

    const upgrades = JSON.parse(ncuOutput);

    if (Object.keys(upgrades).length === 0) {
      console.log('✨ All dependencies are up to date!');
      return;
    }

    console.log('\n📦 Outdated Dependencies:\n');

    // Process each package
    for (const [packageName, latestVersion] of Object.entries(upgrades)) {
      const currentVersion = currentDeps[packageName] || 'unknown';

      const repoUrl = getRepoUrl(packageName);
      const changelogUrl = formatChangelogUrl(repoUrl);

      // Format output
      const packageInfo = `${packageName.padEnd(30)} ${currentVersion.padEnd(15)} → ${latestVersion.padEnd(15)}`;

      if (changelogUrl) {
        console.log(`${packageInfo} ${changelogUrl}`);
      } else {
        console.log(`${packageInfo} (no repo found)`);
      }
    }

    console.log('\n');
  } catch (error) {
    if (error.message.includes('No dependencies')) {
      console.log('✨ All dependencies are up to date!');
    } else {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

main();
