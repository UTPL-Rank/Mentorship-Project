import { Component, Input } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { ChartDataSets, RadialChartOptions } from 'chart.js';

@Component({
  selector: 'sgm-problems-area-chart',
  template: `
    <div class="jumbotron">
      <h5>Problemáticas Encontradas por Área</h5>
      <hr />
      <p>
        Tipos de problemáticas de los estudiantes de nuevo ingreso.
      </p>
      <div class="chart">
        <canvas
          baseChart
          [datasets]="radarChartData"
          [options]="radarChartOptions"
          [labels]="radarChartLabels"
          chartType="radar"
        >
        </canvas>
      </div>
    </div>
  `
})
export class ProblemsAreaChartComponent {
  @Input('data')
  set accompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    const problemsAreaMap = new Map<
      string,
      { label: string;[area: string]: any }
    >([
      ['academic', { label: 'Académico' }],
      ['administrative', { label: 'Administrativo' }],
      ['economic', { label: 'Económico' }],
      ['psychosocial', { label: 'Psicosocial' }],
      ['other', { label: 'Otro' }]
    ]);

    const areasMap = new Map<string, number>([]);

    accompaniments.forEach(({ problems, area: { reference: { id } } }) => {
      areasMap.set(id, 0);

      if (problems.academic) {
        const data = problemsAreaMap.get('academic') as any;
        data[id] = (data.hasOwnProperty(id) ? data[id] : 0) + 1;
        problemsAreaMap.set('academic', data);
      }
      if (problems.administrative) {
        const data = problemsAreaMap.get('administrative') as any;
        data[id] = (data.hasOwnProperty(id) ? data[id] : 0) + 1;
        problemsAreaMap.set('administrative', data);
      }
      if (problems.economic) {
        const data = problemsAreaMap.get('economic') as any;
        data[id] = (data.hasOwnProperty(id) ? data[id] : 0) + 1;
        problemsAreaMap.set('economic', data);
      }
      if (problems.psychosocial) {
        const data = problemsAreaMap.get('psychosocial') as any;
        data[id] = (data.hasOwnProperty(id) ? data[id] : 0) + 1;
        problemsAreaMap.set('psychosocial', data);
      }
      if (problems.other) {
        const data = problemsAreaMap.get('other') as any;
        data[id] = (data.hasOwnProperty(id) ? data[id] : 0) + 1;
        problemsAreaMap.set('other', data);
      }
    });

    const setsMap = new Map<string, { data: number[]; label: string }>([]);
    const areas = Array.from(areasMap.keys());
    const problems = Array.from(problemsAreaMap.values());

    areas.forEach(area => {
      const data: Array<any> = [];
      problems.forEach(problem => {
        data.push(problem[area] || null);
      });

      setsMap.set(area, { label: area, data });
    });

    this.radarChartLabels = problems.map(r => r.label);
    this.radarChartData = Array.from(setsMap.values());
  }

  public radarChartOptions: RadialChartOptions = {
    responsive: true
  };

  public radarChartLabels!: Array<string>;
  public radarChartData!: ChartDataSets[];
}
