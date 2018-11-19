import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BenchmarkPage } from '../pages/benchmark/benchmark';
import { StatsPage } from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QRScanner } from '@ionic-native/qr-scanner';
import {ScanQrPage} from "../pages/scan-qr/scan-qr";

@NgModule({
  declarations: [
    MyApp,
    BenchmarkPage,
    StatsPage,
    TabsPage,
    ScanQrPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BenchmarkPage,
    StatsPage,
    TabsPage,
    ScanQrPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
