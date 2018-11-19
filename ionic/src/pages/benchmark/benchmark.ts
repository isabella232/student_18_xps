import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import lib from '../../shared/lib';
import Kyber from "@dedis/kyber-js";

@Component({
  selector: 'page-about',
  templateUrl: 'benchmark.html'
})
export class BenchmarkPage {

  private benchmarkStatus: string;

  constructor(public navCtrl: NavController) {

  }

  async startBenchmark(){
    console.log("Starting Schnorr benchmark...");
    const schnorr = Kyber.sign.schnorr;
    const nist = Kyber.curve.nist;

    const group = new nist.Curve(nist.Params.p256);
    const secretKey = group.scalar().pick();
    const publicKey = group.point().mul(secretKey, null);

    const start = new Date();

    let i;
    let verificationError = false;

    for (i = 0; i < 1000; i++) {
      const message = new Uint8Array([0, 1, 2, 3]);

      const sig = schnorr.sign(group, secretKey, message);

      verificationError = !schnorr.verify(group, publicKey, message, sig);
      this.benchmarkStatus = `Benchmark: ${100 * i / 1000}%`;


      if (verificationError) {
        console.log(`An error occurred while verifying signature (i=${i})`);
        this.benchmarkStatus = `An error occurred while verifying signature (i=${i})`;
        break;
      }

      if (i % 100 === 0) {
        console.log(`Benchmark: ${100 * i / 1000}%`);
      }
    }
    const end = new Date();
    // @ts-ignore
    console.log(`Benchmark completed in ${end - start}ms.`);
    // @ts-ignore
    this.benchmarkStatus = `Benchmark completed in ${end - start}ms.`;
  }

}
