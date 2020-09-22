import { Component, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { Analytics } from '../../../models/analytics';

@Component({
  selector: 'sgm-mentors-per-degree',
  templateUrl: './mentor-per-degree.component.html',
  styleUrls: [
    '../../styles/base-analytics-card.scss',
    './mentor-per-degree.component.scss',
  ],
})
export class MentorsPerDegreeComponent {

  /**
   * mentors data from the parent component
   */
  private sourceMentors: null | Array<Analytics.Mentor>;

  public chartLabels: Label[] | null;

  public chartData: ChartDataSets[];

  /**
   * chart options
   */
  public readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom'
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };

  /**
   * plugins for the chart
   */
  public readonly chartPlugins = [pluginDataLabels];

  /**
   * input mentors data to the component and transform
   */
  @Input('data')
  set setDataMentors(mentors: null | Array<Analytics.Mentor>) {

    // validate incoming data
    if (!mentors)
      return;

    // save current state of the data
    this.sourceMentors = mentors;

    this.groupMentorsByDegree();
  }

  /**
   * group the mentors by degree and set the data for the chart
   */
  private groupMentorsByDegree(): void {
    const groupsMap = this.sourceMentors.reduce((acc, mentor) => {
      const degreeId = mentor.degree.id;

      if (!(degreeId in acc))
        acc[degreeId] = { notFirstTime: 0, firstTime: 0, name: mentor.degree.name, id: degreeId };

      if (mentor.mentorFirstTime)
        acc[degreeId].firstTime++;
      else
        acc[degreeId].notFirstTime++;

      return acc;
    }, {} as {
      [key: string]: { id: string, name: string, firstTime: number, notFirstTime: number, }
    });

    const groups = Object.values(groupsMap);

    const sorted = groups.sort((curr, next) => curr.name.localeCompare(next.name));

    this.chartLabels = sorted.map(g => g.name);

    this.chartData = [{
      data: sorted.map(g => g.firstTime),
      label: 'Nuevos mentors',
      borderWidth: 0,
      radius: 100,
      borderColor: '#1B6AE1',
      backgroundColor: '#1B6AE1',
      hoverBackgroundColor: '#1B6AE1',
    }, {
      data: sorted.map(g => g.notFirstTime),
      label: 'Mentores ',
      borderWidth: 0,
      radius: 100,
      borderColor: '#95AAC9',
      backgroundColor: '#95AAC9',
      hoverBackgroundColor: '#95AAC9',
    }];
  }
}
