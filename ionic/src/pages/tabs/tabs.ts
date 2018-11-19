import { Component } from '@angular/core';

import { BenchmarkPage } from '../benchmark/benchmark';
import { StatsPage } from '../stats/stats';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StatsPage;
  tab2Root = BenchmarkPage;

  constructor() {

  }
}
