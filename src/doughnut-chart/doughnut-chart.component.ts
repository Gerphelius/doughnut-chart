import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ArcElement, Chart, ChartData, ChartOptions, Plugin } from 'chart.js';
import { AnyObject } from 'chart.js/dist/types/basic';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent {
  /**
   * Skips a couple of frames to prevent shadow arcs from blinking
   */
  private _skipChartDrawFrames = 3;

  public doughnutChartLabels: string[] = ['1', '2', '3', '4', 'Other'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [50, 10, 350, 10, 450, 10, 150, 10],
        borderWidth: 0,
        backgroundColor: [
          '#16264C',
          'transparent',
          '#00FF66',
          'transparent',
          '#00C2FF',
          'transparent',
          '#883AFF',
          'transparent',
        ],
      },
    ],
  };
  public chartOptions: ChartOptions<'doughnut'> = {
    cutout: '90%',
    rotation: 90,
    radius: '95%',
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  public arcsShadow: Plugin<'doughnut', AnyObject> = {
    id: 'arcs_shadow',
    beforeDatasetDraw: (chart: Chart<'doughnut'>) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);

      if (this._skipChartDrawFrames > 0) {
        --this._skipChartDrawFrames;

        return;
      }

      if (!meta.hidden) {
        (meta.data as ArcElement[]).forEach((element) => {
          if (element.options.backgroundColor !== 'transparent') {
            ctx.save();

            ctx.shadowColor = String(element.options.backgroundColor);
            ctx.shadowBlur =
              element.options.backgroundColor === '#16264C' ? 0 : 10;

            ctx.beginPath();
            ctx.arc(
              element.x,
              element.y,
              (element.innerRadius + element.outerRadius) / 2,
              element.startAngle + 0.01,
              element.endAngle - 0.01
            );
            ctx.lineWidth = element.outerRadius - element.innerRadius - 2;
            ctx.stroke();
            ctx.restore();
          } else {
            element.endAngle = element.startAngle;
          }
        });
      }
    },
  };

  public outline: Plugin<'doughnut', AnyObject> = {
    id: 'arcs_shadow',
    beforeDatasetDraw: (chart: Chart<'doughnut'>) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const oultineColor = '#16264C';

      if (!meta.hidden) {
        ctx.save();

        ctx.beginPath();
        ctx.arc(
          meta.data[0].x,
          meta.data[0].y,
          (meta.data[0] as ArcElement).outerRadius + chart.width / 45,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = oultineColor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          meta.data[0].x,
          meta.data[0].y,
          (meta.data[0] as ArcElement).innerRadius - chart.width / 45,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = oultineColor;
        ctx.stroke();

        ctx.restore();
      }
    },
  };
}
