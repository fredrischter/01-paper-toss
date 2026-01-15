# Android Build - Java Version Requirements

## Overview

Capacitor 7 requires **Java 21** for building Android applications. However, we provide support for local development with Java 17.

## CI/CD (GitHub Actions)

The CI/CD pipeline is configured to use **Java 21** automatically. No additional steps are needed.

## Local Development

### Option 1: Use Java 21 (Recommended)

Install Java 21 on your machine and use the standard build commands:

```bash
npm run android:init          # Initialize Android platform
npm run android:build-debug   # Build debug APK
```

### Option 2: Use Java 17 (If Java 21 is not available)

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
