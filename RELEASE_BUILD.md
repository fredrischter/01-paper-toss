# Building Release for Google Play Store

## Overview

This guide explains how to build a signed Android App Bundle (AAB) for uploading to the Google Play Store.

## Prerequisites

- Keystore file configured (see below)
- Version code incremented (automatic on CI, or run `npm run version:increment`)
- Java 21 installed (or use Java 17 compatibility mode)

## Build Process

### Automatic Build (CI/CD)

When you push to the `main` branch, the CI/CD workflow automatically:

1. **Increments version code** in `android-version.json`
2. **Commits** the version change back to repository
3. **Builds both**:
   - APK: `app-release.apk` (for direct installation)
   - AAB: `app-release.aab` (for Google Play Store)
4. **Uploads artifacts** to GitHub Actions

Download the AAB from the workflow artifacts and upload to Google Play Console.

### Manual Build

#### Option 1: Build AAB with Java 21

```bash
npm run android:bundle
```

#### Option 2: Build AAB with Java 17

```bash
npm run android:bundle:java17
```

The AAB file will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Keystore Configuration

### For Local Builds

1. Place your keystore file in `android/app/` directory
2. Create `android/key.properties`:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=YOUR_KEY_ALIAS
storeFile=your-keystore-file.jks
```

### For CI/CD Builds

Configure these secrets in your GitHub repository:

- `KEYSTORE_BASE64`: Base64-encoded keystore file
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_PASSWORD`: Key password
- `KEY_ALIAS`: Key alias

To generate base64 encoded keystore:
```bash
base64 -i your-keystore-file.jks | pbcopy  # macOS
base64 -w 0 your-keystore-file.jks  # Linux
```

## Release Configuration

The release build is configured with:

- ✅ **Signed**: Using your keystore configuration
- ✅ **Not debuggable**: `debuggable false` is set
- ✅ **Optimized**: ProGuard rules applied (currently with `minifyEnabled false`)
- ✅ **Version managed**: Auto-incremented version code

## Google Play Store Upload

1. **Download AAB** from CI artifacts or build locally
2. **Go to** [Google Play Console](https://play.google.com/console)
3. **Navigate to** your app → Release → Production
4. **Create new release** and upload the AAB file
5. **Review and rollout** the release

## Troubleshooting

### "All uploaded bundles must be signed"

This error occurs if:
- Keystore is not configured properly
- Using debug build instead of release build

**Solution**: Ensure keystore secrets are set up correctly in GitHub or locally.

### "Version code must be higher than previous upload"

**Solution**: Increment version before building:
```bash
npm run version:increment
```

### Build fails with "invalid source release: 21"

**Solution**: Use Java 17 compatibility mode:
```bash
npm run android:bundle:java17
```

## Build Artifacts

### APK vs AAB

- **APK**: Can be installed directly on devices. Good for testing and sharing.
- **AAB**: Required for Google Play Store. Google Play optimizes the app for each device configuration.

### Output Locations

- **APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`

## Version Management

See [VERSION_MANAGEMENT.md](VERSION_MANAGEMENT.md) for detailed information about version management.
