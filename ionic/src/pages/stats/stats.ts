import {Component, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ScanQrPage} from "../scan-qr/scan-qr";
import { Storage } from '@ionic/storage';
import { FabContainer } from 'ionic-angular';


import {Socket, getServerIdentityFromAddress} from "../../shared/lib/dedjs/network/NSNet";
import dedjs from "../../shared/lib/dedjs/";
const Convert = dedjs.Convert;
const Net = dedjs.network.NSNet;
const RequestPath = dedjs.network.RequestPath;
const DecodeType = dedjs.network.DecodeType;
const Helper = dedjs.Helper;
const StatusExtractor = require("../../shared/lib/dedjs/extractor/StatusExtractor");

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
        try {
          let server = Convert.parseJsonServerIdentity(this.conodeJSON);
          console.log("Server identity: ",server);
          this.loadServerStats(server);
        }
        catch (error) {
          console.error(error);
        }
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

  /**
   * Triggers the loading of server stats to be displayed
   * TODO method not working, need to be fixed. Issue might be related to WS in react native
   * @param server
   */
  loadServerStats(server) {
    console.log("Loading stats for server: " + server.websocketAddr);

    const address = server.websocketAddr;
    const cothoritySocket = new Socket(address, RequestPath.STATUS);
    const statusRequestMessage = {};

    getServerIdentityFromAddress(server.addr)
      .then(serverIdentity => {
        cothoritySocket.send(RequestPath.STATUS_REQUEST, DecodeType.STATUS_RESPONSE, statusRequestMessage)
          .then(response => {
            console.log("Server responded");
            response.conode = server;
            response.serveridentity = serverIdentity;
            console.log("Response=", response);
            //let statsList = createStatsList(response);
            //console.log(statsList);
            //return statsList;
            return response;
          })
          .catch(function (error) {
            console.log("Error communicating with server.", error.message);
            console.log(error.stack);
            return {
              status: {Generic: {field: {Version: error}}},
              conode: server
            }
          });
      })
      .catch(error => {
        console.log("Error getting server identity.", error);
        console.log(error.stack);
      });
  }


}

