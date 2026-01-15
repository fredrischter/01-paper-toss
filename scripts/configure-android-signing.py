#!/usr/bin/env python3
"""
Script to configure Android APK signing in build.gradle
and patch Java version for compatibility
"""

import os
import sys
import re

BUILD_GRADLE_PATH = "android/app/build.gradle"

# Capacitor files that need Java version patching
CAPACITOR_GRADLE_FILES = [
    "android/app/capacitor.build.gradle",
    "node_modules/@capacitor/android/capacitor/build.gradle",
    "android/capacitor-cordova-android-plugins/build.gradle"
]

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
    
    # Process insertions in reverse order to avoid line number recalculation
    # 1. Insert signingConfig reference in release buildType (highest line number)
    signing_ref = '''            if (keystorePropertiesFile.exists()) {
                signingConfig = signingConfigs.release
            }
'''
    lines.insert(release_line + 1, signing_ref)
    
    # 2. Insert signingConfigs before buildTypes (middle line number)
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
    
    # 3. Insert keystore properties loading after plugin declaration (lowest line number)
    keystore_config = '''
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
'''
    lines.insert(plugin_line + 1, keystore_config)
    
    # Write back
    with open(BUILD_GRADLE_PATH, 'w') as f:
        f.writelines(lines)
    
    print(f"✓ Android signing configuration applied to {BUILD_GRADLE_PATH}")

def patch_java_version():
    """
    Patch Capacitor's auto-generated build.gradle files to use Java 17.
    Capacitor 7 defaults to Java 21, but this ensures compatibility with Java 17
    which is currently used by the CI workflow on the main branch.
    
    Patches multiple Gradle files:
    - android/app/capacitor.build.gradle (app-specific Capacitor config)
    - node_modules/@capacitor/android/capacitor/build.gradle (Capacitor library)
    - android/capacitor-cordova-android-plugins/build.gradle (Cordova plugins)
    """
    patched_count = 0
    skipped_count = 0
    
    for gradle_file in CAPACITOR_GRADLE_FILES:
        if not os.path.exists(gradle_file):
            print(f"⊘ Skipping {gradle_file} (not found)")
            skipped_count += 1
            continue
        
        with open(gradle_file, 'r') as f:
            content = f.read()
        
        # Replace VERSION_21 with VERSION_17
        original_content = content
        content = re.sub(r'JavaVersion\.VERSION_21', 'JavaVersion.VERSION_17', content)
        
        if content == original_content:
            print(f"⊘ Skipping {gradle_file} (already patched or no VERSION_21 found)")
            skipped_count += 1
            continue
        
        with open(gradle_file, 'w') as f:
            f.write(content)
        
        print(f"✓ Patched {gradle_file} to use Java 17")
        patched_count += 1
    
    if patched_count > 0:
        print(f"\nJava version patching: {patched_count} file(s) patched, {skipped_count} file(s) skipped")
    else:
        print(f"✓ All Capacitor files already compatible with Java 17")

if __name__ == "__main__":
    # First patch Java version if needed
    patch_java_version()
    # Then configure signing
    configure_signing()
