import { Component } from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ScanQrPage} from "../scan-qr/scan-qr";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  private conodeJSON: string;
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


  scanOnclick() {
    this.navCtrl.push(ScanQrPage);
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

