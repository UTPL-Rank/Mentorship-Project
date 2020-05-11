import { Component, Input } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from "ng2-charts";
import { FirestoreAccompaniments } from "../../../models/models";

@Component({
  selector: "sgm-degrees-chart",
  template: `
    <div class="jumbotron">
      <h5>Número de Seguimientos por Carrera</h5>
      <hr />
      <p>
        Seguimientos realizados por carrera.
      </p>
      <div class="chart">
        <canvas
          baseChart
          [datasets]="barChartData"
          [labels]="barChartLabels"
          [options]="barChartOptions"
          [plugins]="barChartPlugins"
          [legend]="barChartLegend"
          [chartType]="barChartType"
        >
        </canvas>
      </div>
    </div>
  `
})
export class DegreesChartComponent {
  @Input("data")
  set accompaniments(accompaniments: FirestoreAccompaniments) {
    const degreesMap = new Map<string, number>([]);
    accompaniments.forEach(({ degree: { reference: { id } } }) => {
      const count = degreesMap.has(id) ? degreesMap.get(id) : 0;
      degreesMap.set(id, count + 1);
    });
    this.barChartLabels = Array.from(degreesMap.keys());
    this.barChartData = [
      {
        data: Array.from(degreesMap.values()),
        label: "Series A"
      }
    ];
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },

    plugins: {
      datalabels: {
        anchor: "end",
        align: "end"
      }
    }
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = "bar";
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[];
}
