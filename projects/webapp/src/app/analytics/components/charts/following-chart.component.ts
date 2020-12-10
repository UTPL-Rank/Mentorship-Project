import { Component, Input } from "@angular/core";
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { ChartOptions } from "chart.js";

@Component({
  selector: "sgm-following-chart",
  template: `
    <div class="jumbotron">
      <h5>Tipos de Seguimiento</h5>
      <hr />
      <p>
        Tipos de seguimientos que se realizan a los estudiantes de nuevo
        ingreso.
      </p>
      <div class="chart">
        <canvas
          baseChart
          chartType="pie"
          [data]="data"
          [labels]="labels"
          legend="true"
          [options]="pieChartOptions"
        >
        </canvas>
      </div>
    </div>
  `
})
export class FollowingChartComponent {
  public labels: Array<string>;
  public data: Array<number>;

  @Input("data")
  set accompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    let followingsMap: Map<SGMAccompaniment.FollowingType, { label: string; count: number }>;
    let presencial = 0;
    let virtual = 0;

    accompaniments.forEach(({ followingKind }) =>
      followingKind === "sgm#virtual" ? virtual++ : presencial++
    );

    followingsMap = new Map([
      ["sgm#virtual", { label: "Virtuales", count: virtual }],
      ["sgm#presencial", { label: "Presenciales", count: presencial }]
    ]);

    this.labels = Array.from(followingsMap.values()).map(d => d.label);
    this.data = Array.from(followingsMap.values()).map(d => d.count);
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "bottom"
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
}
