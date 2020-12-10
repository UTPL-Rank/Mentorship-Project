import { Component, Input } from "@angular/core";
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { ChartOptions } from "chart.js";

@Component({
  selector: "sgm-problems-chart",
  template: `
    <div class="jumbotron">
      <h5>Problemáticas Encontradas</h5>
      <hr />
      <p>
        Tipos de problemáticas de los estudiantes de nuevo ingreso.
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
export class ProblemsChartComponent {
  public labels: Array<string>;
  public data: Array<number>;

  @Input("data")
  set accompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    const problemsMap = new Map([
      ["academic", { count: 0, label: "Académico" }],
      ["administrative", { count: 0, label: "Administrativo" }],
      ["economic", { count: 0, label: "Económico" }],
      ["psychosocial", { count: 0, label: "Psicosocial" }],
      ["other", { count: 0, label: "Otro" }]
    ]);

    accompaniments.forEach(({ problems }) => {
      if (problems.academic) {
        const { label, count } = problemsMap.get("academic");
        problemsMap.set("academic", { label, count: count + 1 });
      }
      if (problems.administrative) {
        const { label, count } = problemsMap.get("administrative");
        problemsMap.set("administrative", { label, count: count + 1 });
      }
      if (problems.economic) {
        const { label, count } = problemsMap.get("economic");
        problemsMap.set("economic", { label, count: count + 1 });
      }
      if (problems.psychosocial) {
        const { label, count } = problemsMap.get("psychosocial");
        problemsMap.set("psychosocial", { label, count: count + 1 });
      }
      if (!!problems.other) {
        const { label, count } = problemsMap.get("other");
        problemsMap.set("other", { label, count: count + 1 });
      }
    });

    this.labels = Array.from(problemsMap.values()).map(d => d.label);
    this.data = Array.from(problemsMap.values()).map(d => d.count);
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
