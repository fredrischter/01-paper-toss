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
    let versionData;
    try {
        const fileContent = fs.readFileSync(VERSION_FILE, 'utf8');
        versionData = JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading or parsing ${VERSION_FILE}: ${error.message}`);
        process.exit(1);
    }
    
    if (!versionData.versionCode || typeof versionData.versionCode !== 'number') {
        console.error(`Error: Invalid versionCode in ${VERSION_FILE}`);
        process.exit(1);
    }
    
    const oldVersionCode = versionData.versionCode;

    // Increment version code
    versionData.versionCode += 1;

    // Write back
    try {
        fs.writeFileSync(VERSION_FILE, JSON.stringify(versionData, null, 2) + '\n', 'utf8');
    } catch (error) {
        console.error(`Error writing ${VERSION_FILE}: ${error.message}`);
        process.exit(1);
    }

    console.log(`✓ Version code incremented: ${oldVersionCode} → ${versionData.versionCode}`);
    console.log(`  Version name: ${versionData.versionName}`);
    
    return versionData;
}

// Run if called directly
if (require.main === module) {
    incrementVersion();
}

module.exports = { incrementVersion };
