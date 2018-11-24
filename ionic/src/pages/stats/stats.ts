import {Component, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ScanQrPage} from "../scan-qr/scan-qr";
import { Storage } from '@ionic/storage';
import { FabContainer } from 'ionic-angular';


import lib from "../../shared/lib";
const Convert = lib.dedjs.Convert;
const Net = lib.dedjs.network.NSNet;
const RequestPath = lib.dedjs.network.RequestPath;
const DecodeType = lib.dedjs.network.DecodeType;
const Helper = lib.dedjs.Helper;
const StatusExtractor = lib.dedjs.extractor.StatusExtractor;

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  private conodeJSON: string;
  @ViewChild('fab') addFab : FabContainer;
  constructor(public navCtrl: NavController,
              private modalController: ModalController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private storage: Storage) {
    storage.get('conodeJSON').then((val) => {
      if(val === undefined ||val === null){
        console.log('No conode json stored.');
      } else {
        console.log(`Loaded stored conode json.${val}`);
        this.conodeJSON = val;
        //TODO load server stats here.
      }
    });

  }


  ionViewWillEnter(){
    let tempConodeJSON = this.navParams.get("conodeJSON");
    if(tempConodeJSON === undefined){
      console.log(`Received undefined conode JSON.`);
    }else {
      this.conodeJSON = tempConodeJSON;
      this.storage.set('conodeJSON', tempConodeJSON);
      //TODO load server stats here.
    }
  }


  scanOnclick(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ScanQrPage);
  }

  deleteConodeJSON(fab: FabContainer) {
    fab.close();
    this.storage.remove('conodeJSON');
    this.conodeJSON = undefined;
  }


  presentToast(text:string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewWillLeave(){

  }

}

