import { Component, Input } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'sgm-problems-degree-chart',
  template: `
    <div class="jumbotron">
      <h5>Problemáticas Encontradas por Carrera</h5>
      <hr />
      <p>
        Tipos de problemáticas por carrera de los estudiantes de nuevo ingreso.
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
export class ProblemsDegreeChartComponent {

  @Input('data')
  set accompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    const problemsMap = new Map<string, { label: string; data: number[] }>([
      ['academic', { label: 'Académico', data: [] }],
      ['administrative', { label: 'Administrativo', data: [] }],
      ['economic', { label: 'Económico', data: [] }],
      ['psychosocial', { label: 'Psicosocial', data: [] }],
      ['other', { label: 'Otro', data: [] }]
    ]);

    const problemsDegreeMap = new Map<
      string,
      {
        academic: number;
        administrative: number;
        economic: number;
        psychosocial: number;
        other: number;
      }
    >();

    accompaniments.forEach(({ problems, degree: { reference: { id } } }) => {
      if (problemsDegreeMap.has(id)) {
        const old = problemsDegreeMap.get(id) as {
          academic: number;
          administrative: number;
          economic: number;
          psychosocial: number;
          other: number;
        };
        problemsDegreeMap.set(id, {
          academic: old.academic + (problems.academic ? 1 : 0),
          administrative:
            old.administrative + (problems.administrative ? 1 : 0),
          economic: old.economic + (problems.economic ? 1 : 0),
          other: old.other + (problems.other ? 1 : 0),
          psychosocial: old.psychosocial + (problems.psychosocial ? 1 : 0)
        });
      } else {
        problemsDegreeMap.set(id, {
          academic: problems.academic ? 1 : 0,
          administrative: problems.administrative ? 1 : 0,
          economic: problems.economic ? 1 : 0,
          other: problems.other ? 1 : 0,
          psychosocial: problems.psychosocial ? 1 : 0
        });
      }
    });

    const problems = Array.from(problemsMap.keys());
    const degrees = Array.from(problemsDegreeMap.keys());

    degrees.forEach(degree => {
      const count = problemsDegreeMap.get(degree) as any;
      problems.forEach(problem => {
        const { label, data } = problemsMap.get(problem) as any;
        data.push(count[problem]);
        problemsMap.set(problem, { label, data });
      });
    });

    this.barChartData = Array.from(problemsMap.values());
    this.barChartLabels = Array.from(problemsDegreeMap.keys());
    console.log(this.barChartData);
    console.log(this.barChartLabels);
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  public barChartLabels!: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData!: ChartDataSets[];
}
