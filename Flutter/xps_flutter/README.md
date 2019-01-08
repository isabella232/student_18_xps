#  Cross-platform: Flutter

This is the Flutter version of the app. See [main README](https://github.com/dedis/student_18_xps/blob/master/README.md) to learn about the simple features developed using the Cothority.

## Requirements
 - Flutter framework, [see steps here](https://flutter.io/get-started/install/)
 - [Android Studio](https://developer.android.com/studio/index.html) + Flutter plugin
 - For iOS development, Xcode

## Before Running
Once flutter is installed, command ```flutter doctor```is always a good way to make sure that everything needed is properly installed/configure.

Also make sure to have added Flutter [permanently to your path](https://flutter.io/setup-macos/#update-your-path).

## Running
Simply run
``` shell
flutter run
```

to deploy the app to your open emulator.

## What's working
 - QR Code reader:
   - [x] Android
   - [x] iOS


 - Store Conode info on device memory:
   - [x] Android
   - [x] iOS


 - Load Conode info from device memory:
   - [x] Android
   - [X] iOS


 - Tab Layout:
   - [x] Android
   - [X] iOS (but Android's style)


 - Display status of a conode:
   - [x] Android
   - [ ] iOS (see known issues)


 - Has necessary libraries to perform basic cryptographic operations on elliptic curves:
   - [x] Android
   - [x] iOS


 - Benchmark (1000 Schnorr's signatures and verifications):
   - [x] Android
   - [ ] iOS (see known issues)

## Known issues
 - The iOS version cannot display a conode status nor run the benchmark. A rewrite of the cothority in Dart or Swift is needed. The Android version uses the already available Java version of the cothority.

## Sources
 - Setup for Flutter, https://flutter.io/get-started/install/
 - Flutter QR Code scanner, https://medium.com/@alfianlosari/building-flutter-qr-code-generator-scanner-and-sharing-app-703e73b228d3
 - PriFi Android README, https://github.com/dedis/prifi/blob/prifi-android/README_mobile.md
 - Cothority external libraries sources, https://github.com/dedis/cothority/tree/master/external

## Licensing
This application is released under the [Apache 2.0 License](https://github.com/dedis/student_18_xps/blob/master/Flutter/xps_flutter/LICENSE).
