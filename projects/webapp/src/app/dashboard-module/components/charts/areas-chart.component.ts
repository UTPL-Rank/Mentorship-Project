import { Component, Input } from "@angular/core";
import { ChartOptions } from "chart.js";
import { FirestoreAccompaniments } from "../../../models/models";

@Component({
  selector: "sgm-areas-chart",
  template: `
    <div class="jumbotron">
      <h5>Número de Seguimientos por Área</h5>
      <hr />
      <p>
        Seguimientos que se realizan por área.
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
export class AreasChartComponent {
  public labels: Array<string>;
  public data: Array<number>;

  @Input("data")
  set accompaniments(accompaniments: FirestoreAccompaniments) {
    const areasMap = new Map<string, number>([]);

    accompaniments.forEach(({ area: { reference: { id } } }) => {
      const count = areasMap.has(id) ? areasMap.get(id) : 0;
      areasMap.set(id, count + 1);
    });

    this.labels = Array.from(areasMap.keys());
    this.data = Array.from(areasMap.values());
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
