import 'zone.js';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DoughnutChartComponent],
  template: `
    <app-doughnut-chart />
  `,
})
export class App {}

bootstrapApplication(App);
