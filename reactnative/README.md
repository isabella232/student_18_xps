#  Cross-platform: React Native

This is the React Native version of the app. See [main README](https://github.com/dedis/student_18_xps/blob/master/README.md) to learn about the simple features developed using the Cothority.

## Requirements
 - Node.js, [see steps here](https://nodejs.org/en/download/)
 - Any React Native capable IDE (e.g. [WebStorm])(https://www.jetbrains.com/webstorm/)
 - React Native, [see tab 'Building Projects with Native Code'](https://facebook.github.io/react-native/docs/getting-started.html)

## Before Running
First, we need to install all Node.js necessary packages :
```shell
npm install
```

While developing with React Native, I found that it was often necessary after installing packages to perform the following tasks:
 - Delete the ```ios```and ```android``` folders.
 - Run ```react-native eject```
which will regenerate both ios and android folders.
 - Run ```react-native link``` which link needed packages to your build config files.
 - Sometimes you might to manually inverse ```jcenter()```and ```google()``` in your ```android/build.gradle```file to fix some compilation issue. **EDIT 30.10.2018:** this seems to have been [fixed](https://github.com/react-native-community/react-native-share/pull/387) with the latest react-native version, even though it still happens sometimes...


## Running
Simply run
``` shell
react-native run-android
```
or
``` shell
react-native run-ios
```
in your terminal. The first compilation will take minutes, but afterwards editing ``.js`` files will trigger a refresh of the app's files within seconds, as it won't recompile all libraries.

 **⚠ WARNING ⚠** : As of commit [85968ac](https://github.com/dedis/student_18_xps/commit/85968ac2f4de837898fd564426ce50084146830b) (which included an update of used react-native core), iOS build is unstable and is yet to be fixed. The previously working implementations are still checked in the following section.

## What's working
 - QR Code reader:
   - [x] Android
   - [x] iOS


 - Store Conode info on device memory:
   - [x] Android
   - [x] iOS


 - Load Conode info from device memory:
   - [x] Android
   - [ ] iOS


 - Tab Layout:
   - [x] Android
   - [ ] iOS (no build since commit [85968ac](https://github.com/dedis/student_18_xps/commit/85968ac2f4de837898fd564426ce50084146830b))


 - Display status of a conode:
   - [ ] Android (React Native's websocket implementation causes the connection to drop unexpectedly when querying a server's identity)
   - [ ] iOS (same as android)


 - Has necessary libraries to perform basic cryptographic operations on elliptic curves:
   - [x] Android
   - [x] iOS


 - Benchmark (1000 Schnorr's signatures and verifications):
   - [x] Android (but on UI thread)
   - [x] iOS (but on UI thread)

## Known issues
 - React Native's websocket implementation causes the connection to drop unexpectedly when querying a server's identity. Due to this, it is currently not possible to get a Conode's status.

 - Background tasks: Multiple 3rd party libraries or solutions where tested ([here](https://github.com/devfd/react-native-workers), [here](https://medium.com/@inkdrop/a-simple-way-to-run-js-in-background-thread-on-react-native-8fff345576da), [here](https://github.com/jamesisaac/react-native-background-task) and [here](https://hackernoon.com/easy-os-background-tasks-in-react-native-bc4476c48b8a)) but none was found to be working and suitable for our needs.

 - iOS build fails since commit [85968ac](https://github.com/dedis/student_18_xps/commit/85968ac2f4de837898fd564426ce50084146830b)

 - React Native app will sometimes fail to connect to remote debugger. Best solution is to kill the ```Metro Bundler``` (which opens in a new terminal window) with ```Ctrl+c```, uninstall the app on emulators and re-run the app.

 - When debugging the app and activating either ```Live reloading``` or ```Hot reloading```, breakpoints will not be detected at their correct lines if the javascript source code is updated. The solution to debug properly is to apply the same steps described at the previous bullet point.

## Sources
 - Setup for React Native, https://facebook.github.io/react-native/docs/getting-started.html
 - React Native QR Code scanner module, https://github.com/moaazsidat/react-native-qrcode-scanner
 - PopCoins app sources, https://github.com/dedis/popcoins
 - PopCoins older repo, https://github.com/dedis/student_18_xplatform
 - Cothority external libraries sources, https://github.com/dedis/cothority/tree/master/external
## Licensing
TODO
