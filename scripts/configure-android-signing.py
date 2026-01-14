#!/usr/bin/env python3
"""
Script to configure Android APK signing in build.gradle
"""

import os
import sys

BUILD_GRADLE_PATH = "android/app/build.gradle"

def configure_signing():
    if not os.path.exists(BUILD_GRADLE_PATH):
        print(f"Error: {BUILD_GRADLE_PATH} not found")
        sys.exit(1)
    
    with open(BUILD_GRADLE_PATH, 'r') as f:
        content = f.read()
    
    # Check if already configured
    if "keystorePropertiesFile" in content:
        print(f"✓ Signing configuration already present in {BUILD_GRADLE_PATH}")
        return
    
    lines = content.splitlines(keepends=True)
    
    # Find insertion points
    plugin_line = -1
    buildtypes_line = -1
    release_line = -1
    
    for i, line in enumerate(lines):
        if "apply plugin: 'com.android.application'" in line:
            plugin_line = i
        if "buildTypes {" in line:
            buildtypes_line = i
        if buildtypes_line > 0 and "release {" in line and release_line == -1:
            release_line = i
    
    if plugin_line == -1 or buildtypes_line == -1 or release_line == -1:
        print("Error: Could not find required sections in build.gradle")
        sys.exit(1)
    
    # Insert keystore properties loading after plugin declaration
    keystore_config = '''
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
'''
    lines.insert(plugin_line + 1, keystore_config)
    
    # Adjust line numbers after insertion
    buildtypes_line += 1
    release_line += 1
    
    # Insert signingConfigs before buildTypes
    signing_configs = '''    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
'''
    lines.insert(buildtypes_line, signing_configs)
    
    # Adjust release_line after insertion
    release_line += 1
    
    # Insert signingConfig reference in release buildType
    signing_ref = '''            if (keystorePropertiesFile.exists()) {
                signingConfig signingConfigs.release
            }
'''
    lines.insert(release_line + 1, signing_ref)
    
    # Write back
    with open(BUILD_GRADLE_PATH, 'w') as f:
        f.writelines(lines)
    
    print(f"✓ Android signing configuration applied to {BUILD_GRADLE_PATH}")

if __name__ == "__main__":
    configure_signing()
