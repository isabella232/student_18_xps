#  Cross-platform: Ionic

This is the Ionic version of the app. See [main README](https://github.com/dedis/student_18_xps/blob/master/README.md) to learn about the simple features developed using the Cothority.

## Requirements
 - Node.js, [see steps here](https://nodejs.org/en/download/)
 - Any JS capable IDE (e.g. [WebStorm](https://www.jetbrains.com/webstorm/))
 - [Ionic](https://ionicframework.com/getting-started#cli)

## Before Running
We need to install all Node.js necessary packages :
```shell
npm install
```

## Running

For Android
``` shell
ionic cordova emulate android -- -- --gradleArg=--no-daemon
```
and iOS
``` shell
ionic cordova emulate ios -- --buildFlag="-UseModernBuildSystem=0"
```
in your terminal.

 **⚠ WARNING ⚠** : For Android, the arguments ```-- -- --gradleArg=--no-daemon``` are necessary to avoid an issue with cordova build being stuck at
``` shell
Built the following apk(s):
	.../student_18_xps/ionic/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

  This fix may not always work as reported [here](https://github.com/Microsoft/vsts-cordova-tasks/issues/85). A fix for this is to reboot the emulated device.

## What's working
 - QR Code reader:
   - [x] Android
   - [x] iOS


 - Store Conode info on device memory:
   - [x] Android
   - [x] iOS


 - Load Conode info from device memory:
   - [x] Android
   - [x] iOS


 - Tab Layout:
   - [x] Android
   - [x] iOS


 - Display status of a conode:
   - [ ] Android (websockets not working)
   - [ ] iOS (same as android)


 - Has necessary libraries to perform basic cryptographic operations on elliptic curves:
   - [x] Android
   - [x] iOS


 - Benchmark (1000 Schnorr's signatures and verifications):
   - [x] Android (but on UI thread)
   - [x] iOS (but on UI thread)

## Known issues
 - There is an issue with the Cordova framework, used by Ionic, which can be stuck at the packaging of the .apk file. A fix is to disable the Gradle daemon after building the app (as mentioned previously). With this fix, the issue arise rarely, and when it happen the only solution is a cold boot of the Android emulator.

 - The iOS build fails with the new build system introduced by Xcode 10. A fix is to fallback to the legacy build system with the proper CLI options as mentioned previously.

 - The Schnorr signature benchmark runs on the UI thread.

## Sources
 - Setup for Ionic, https://ionicframework.com/getting-started#cli
 - Ionic QR Code scanner module, https://medium.com/@piashsarker/native-qr-scanner-implementation-in-ionic-6e1ef01335ea
 - PopCoins app sources, https://github.com/dedis/popcoins
 - Cothority external libraries sources, https://github.com/dedis/cothority/tree/master/external

## Licensing
This application is released under the [Apache 2.0 License](https://github.com/dedis/student_18_xps/blob/master/ionic/LICENSE).
