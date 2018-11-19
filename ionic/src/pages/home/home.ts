import { Component } from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ScanQrPage} from "../scan-qr/scan-qr";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private conodeJSON: string;
  constructor(public navCtrl: NavController,
              private modalController: ModalController,
              public navParams: NavParams,
              private toastCtrl: ToastController) {
    this.conodeJSON = navParams.get('data');

  }


  ionViewWillEnter(){
    this.conodeJSON = this.navParams.get("conodeJSON");
    console.log(this.conodeJSON);
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

