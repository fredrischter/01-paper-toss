#!/usr/bin/env node

/**
 * Script to increment Android version code
 * Reads from android-version.json, increments versionCode, and writes back
 */

const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, '..', 'android-version.json');

function incrementVersion() {
    if (!fs.existsSync(VERSION_FILE)) {
        console.error(`Error: ${VERSION_FILE} not found`);
        process.exit(1);
    }

    // Read current version
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    const oldVersionCode = versionData.versionCode;

    // Increment version code
    versionData.versionCode += 1;

    // Write back
    fs.writeFileSync(VERSION_FILE, JSON.stringify(versionData, null, 2) + '\n', 'utf8');

    console.log(`✓ Version code incremented: ${oldVersionCode} → ${versionData.versionCode}`);
    console.log(`  Version name: ${versionData.versionName}`);
    
    return versionData;
}

// Run if called directly
if (require.main === module) {
    incrementVersion();
}

module.exports = { incrementVersion };
