# Android Version Management

## Overview

The Android app version is managed through a centralized version file (`android-version.json`) that tracks both the version code and version name.

## Version File

**`android-version.json`**
```json
{
  "versionCode": 1,
  "versionName": "1.0.0"
}
```

- **versionCode**: Integer that must be incremented for each release (required by Google Play)
- **versionName**: Human-readable version string (e.g., "1.0.0", "1.2.3")

## Building for Google Play Store

Google Play Store requires Android App Bundles (AAB) for uploads. The CI/CD workflow automatically builds both APK and AAB files.

### Build Outputs

- **APK**: For direct installation on devices (`app-release.apk`)
- **AAB**: For Google Play Store uploads (`app-release.aab`)

The AAB format is required by Google Play Store and provides better app distribution optimization.

## Automatic Version Increment (CI/CD)

On the **main branch**, the CI/CD workflow automatically:
1. Increments the `versionCode` by 1
2. Commits the change to `android-version.json`
3. Builds the release APK with the new version

This happens **before** each release build, ensuring every release has a unique, incrementing version code.

### Workflow Behavior

- **On main branch push**: Version is incremented and committed automatically
- **On pull requests**: Version is NOT incremented (debug builds only)
- **Manual builds**: Use the current version from `android-version.json`

## Manual Version Management

### Increment Version Code

```bash
npm run version:increment
```

This increments the version code by 1 and updates `android-version.json`.

### Build Release APK

```bash
npm run android:build
# With Java 17: npm run android:build:java17
```

### Build Release Bundle (AAB) for Google Play

```bash
npm run android:bundle
# With Java 17: npm run android:bundle:java17
```

The AAB file will be located at `android/app/build/outputs/bundle/release/app-release.aab`

### Update Version Name

Manually edit `android-version.json` to change the version name:

```json
{
  "versionCode": 5,
  "versionName": "1.1.0"
}
```

Then commit the change:

```bash
git add android-version.json
git commit -m "chore: update version to 1.1.0"
```

## How It Works

1. **Version Storage**: `android-version.json` is the single source of truth
2. **Version Injection**: The `configure-android-signing.py` script reads this file and updates `android/app/build.gradle` during the build process
3. **Auto-generated Files**: The `android/app/build.gradle` file is auto-generated and NOT committed to git

## Version History

To see version history, check the git log for `android-version.json`:

```bash
git log --oneline -- android-version.json
```

## Best Practices

1. **Never manually edit version in build.gradle** - it will be overwritten
2. **Update version name** when releasing new features (e.g., 1.0.0 → 1.1.0)
3. **Let CI auto-increment version code** - don't do it manually unless necessary
4. **Use semantic versioning** for version names (MAJOR.MINOR.PATCH)

## Troubleshooting

### Version not updating in APK

1. Check `android-version.json` has the correct values
2. Ensure the build process runs `configure-android-signing.py`
3. Clean the build: `cd android && ./gradlew clean`

### Version conflict on Google Play

If Google Play rejects an upload saying "version code must be higher":
1. Manually increment in `android-version.json`
2. Commit and push to trigger new build
3. Or run `npm run version:increment` locally and commit
