#  Cross-platform: NativeScript

This is the NativeScript version of the app. See [main README](https://github.com/dedis/student_18_xps/blob/master/README.md) to learn about the simple features developed using the Cothority.

## Requirements
 - NativeScript CLI, [see steps here](https://docs.nativescript.org/start/quick-setup)
 - Any NativeScript capable IDE (e.g. [WebStorm](https://www.jetbrains.com/webstorm/) with [NativeScript unofficial plugin](https://plugins.jetbrains.com/plugin/8588-nativescript), setup [here](https://medium.com/@iguissouma/the-n-plugin-for-webstormide-78525a3cfd4f))
 - (Windows) [Win64 OpenSSL v1.0.2p](https://slproweb.com/download/Win64OpenSSL-1_0_2p.exe), installed at its suggested path.
 - (Others) \<to fill if necessary\>

## Before Running
In order to have the application fully working, you first install the necessary node modules and then apply the ``.patch`` files provided. To do so, simply run  
``` shell
make apply-patches
```
This will run the ``npm install`` command to install modules, and patch two of them:
 - ``nodeify`` otherwise causes an issue which force the app to close and reports that the ``crypto`` module was not found. ([Source](https://github.com/dedis/student_18_xplatform/issues/35))
 - ``websockets`` has an issue on Android where packets  may be sent again. ([Source](https://github.com/dedis/student_18_xplatform/issues/73))

 You should reapply the patches whenever node modules are installed/updated or recompiled.

## Running
Simply run
``` shell
tns run android
```
in your terminal. The first compilation will take minutes, but afterwards editing ``.js`` files will trigger a refresh of the app's files within seconds, as it won't recompile all libraries.

For IDEs, be aware that the ``--clean`` might be set by default. This ensures a proper recompilation of the libraries used, but also extend compilation time from seconds to minutes if you only edit ``.js`` files.
## Usage
TODO

## Sources
 - Setup for NativeScript, https://docs.nativescript.org/start/quick-setup
 - Setup for WebStorm NativeScript unofficial plugin, https://medium.com/@iguissouma/the-n-plugin-for-webstormide-78525a3cfd4f
 - NativeScript barcode scanner module, https://github.com/EddyVerbruggen/nativescript-barcodescanner
 - PopCoins app sources, https://github.com/dedis/popcoins
 - PopCoins older repo, https://github.com/dedis/student_18_xplatform
## Licensing
TODO
