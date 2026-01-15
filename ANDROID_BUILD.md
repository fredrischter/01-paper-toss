# Android Build - Java Version Requirements

## Overview

Capacitor 7 requires **Java 21** for building Android applications. However, this project currently uses **Java 17 with a compatibility patch** for both CI and local development until Java 21 is widely available.

## CI/CD (GitHub Actions)

The CI/CD pipeline uses **Java 17** with an automatic patch that modifies Capacitor's generated files to be compatible with Java 17.

### How CI Works
1. Java 17 is set up in the workflow
2. Capacitor generates Android files (which default to Java 21)
3. A patch script automatically converts them to Java 17
4. The build completes successfully

**Note:** Once this PR is merged to main, we can upgrade the CI to use Java 21 directly by updating the workflow on the main branch.

## Local Development

### Option 1: Use Java 21 (Recommended for Future)

Install Java 21 on your machine and use the standard build commands:

```bash
npm run android:init          # Initialize Android platform
npm run android:build-debug   # Build debug APK
```

### Option 2: Use Java 17 (Current Standard)

If you only have Java 17 installed, use the special Java 17 commands:

```bash
npm run android:init:java17        # Initialize and patch for Java 17
npm run android:build-debug:java17 # Build debug APK with Java 17
```

Or manually patch after syncing:

```bash
npm run android:sync               # Sync Capacitor
npm run android:patch-java17       # Patch to use Java 17
cd android && ./gradlew assembleDebug
```

## How It Works

The `patch-java-version.sh` script modifies the auto-generated `android/app/capacitor.build.gradle` file to use Java 17 instead of Java 21. This file is regenerated every time you run `npx cap sync android`, so you'll need to re-run the patch script if you sync again.

## Checking Your Java Version

```bash
java -version
```

You should see either:
- `openjdk version "21.x.x"` (for Java 21)
- `openjdk version "17.x.x"` (for Java 17)

## Installing Java 21

### macOS
```bash
brew install openjdk@21
```

### Ubuntu/Debian
```bash
sudo apt-get install openjdk-21-jdk
```

### Windows
Download from [Adoptium](https://adoptium.net/) or use a package manager like Chocolatey.
