import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color } from 'ng2-charts';

@Component({
  selector: 'sgm-pie',
  templateUrl: './pie.component.html',
})
export class PieComponent {

  /**
   * chat data
   */
  data: number[] | null = null;

  @Input('data')
  set _data(v: Array<number>) {
    this.data = v;
  }

  /**
   * chat labels
   */
  labels: string[] | null = null;

  @Input('labels')
  set _labels(v: Array<string>) {
    this.labels = v;
  }

  /**
   * chat options
   */
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: ['white', 'black', 'white', 'black', 'white', 'black'],
        formatter: (value, ctx) => {
          const newLocal = ctx.chart.data.labels;
          if (newLocal) {
            const label = newLocal[ctx.dataIndex];
            return label;
          }
          return value;
        },
      },
    }
  };

  /**
   * chart plugin
   */
  public readonly chartPlugins = [pluginDataLabels];

  /**
   * colors used for the chart
   */
  public readonly chartColors: Array<Color> = [{
    borderWidth: [4, 4],
    borderColor: ['#1B6AE1', '#1B6AE1', '#1B6AE1', '#1B6AE1', '#1B6AE1', '#1B6AE1'],
    backgroundColor: ['#1B6AE1', 'transparent', '#1B6AE1', 'transparent', '#1B6AE1', 'transparent'],
  }];

  /**
   * validation if chats has valid content
   */
  get isValid(): boolean {
    return !!this.data && !!this.labels && this.data.length === this.labels.length;
  }
}
