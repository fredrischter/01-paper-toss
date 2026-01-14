# Android APK Signing Configuration

This project generates signed Android APK files automatically in the CI/CD pipeline.

## How It Works

The GitHub Actions workflow (`.github/workflows/android-build.yml`) now includes steps to:

1. Generate a keystore for signing (or use one from GitHub Secrets)
2. Configure the Android build to sign the release APK
3. Build and upload a signed release APK

## Current Setup (Development)

The workflow currently generates a temporary keystore with these credentials:
- Store Password: `android`
- Key Password: `android`
- Key Alias: `release-key`

⚠️ **Note**: This is suitable for development and testing, but for production releases, you should use a secure keystore stored in GitHub Secrets.

## For Production Use (Recommended)

To use your own keystore for production:

1. Generate a proper keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. Encode the keystore as base64:
```bash
base64 my-release-key.keystore > keystore.b64
```

3. Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):
   - `ANDROID_KEYSTORE_BASE64`: The base64-encoded keystore file
   - `ANDROID_KEYSTORE_PASSWORD`: Your keystore password
   - `ANDROID_KEY_PASSWORD`: Your key password
   - `ANDROID_KEY_ALIAS`: Your key alias

4. Update the workflow to use secrets instead of generating a keystore:
```yaml
- name: Decode and setup keystore
  run: |
    echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > android/app/release-key.keystore

- name: Create signing config
  run: |
    cat > android/key.properties << EOF
    storePassword=${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
    keyPassword=${{ secrets.ANDROID_KEY_PASSWORD }}
    keyAlias=${{ secrets.ANDROID_KEY_ALIAS }}
    storeFile=release-key.keystore
    EOF
```

## Signed APK Location

After a successful build, the signed APK can be downloaded from GitHub Actions artifacts:
- Artifact name: `paper-toss-release-apk`
- File: `app-release.apk`

The APK is signed and ready for distribution to Google Play Console, direct distribution, or other Android app stores.
