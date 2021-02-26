import { Component, Input } from '@angular/core';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'sgm-mentors-with-accompaniments',
  templateUrl: './mentors-with-accompaniments.component.html',
  styleUrls: [
    '../../styles/base-analytics-card.scss',
    './mentors-with-accompaniments.component.scss',
  ]
})
export class MentorsWithAccompanimentsComponent {

  /**
   * mentors data from the parent component
   */
  private sourceMentors!: Array<SGMAnalytics.MentorEntry>;

  /**
   * mentors that has been already filtered
   */
  public mentors!: Array<SGMAnalytics.MentorEntry>;


  /**
   * calculated data of the mentors with accompaniments
   */
  public mentorsWithAccompaniments!: Array<SGMAnalytics.MentorEntry>;

  /**
   * calculated data of the mentors without accompaniments
   */
  public mentorsWithoutAccompaniments!: Array<SGMAnalytics.MentorEntry>;

  /**
   * academic degrees that can be used to filter data
   */
  public filterOptions!: Array<{ name: string, id: string }>;

  /**
   * filter information visualized
   */
  private filter: string | null = null;

  /**
   * chart plugin
   */
  public readonly chartPlugins = [pluginDataLabels];


  /**
   * input mentors data to the component and transform
   */
  @Input('data')
  set setDataMentors(mentors: null | Array<SGMAnalytics.MentorEntry>) {

    // validate data incoming
    if (!mentors)
      return;

    // save new state of the data
    this.sourceMentors = mentors;

    this.groupMentorsByAccompaniments();
    this.calculateDegreeFilter();
  }

  /**
   * Filter mentors
   *
   * @param mentors list of mentors analytics
   */
  private groupMentorsByAccompaniments(): void {
    const filteredMentors = !!this.filter ? this.sourceMentors.filter(m => m.degree.id === this.filter) : this.sourceMentors;
    this.mentors = filteredMentors;

    const groups = filteredMentors.reduce((acc, mentor) => {
      if (mentor.accompanimentsCount === 0)
        acc.withoutAccompaniments.push(mentor);
      else
        acc.withAccompaniments.push(mentor);
      return acc;
    }, {
        withAccompaniments: ([] as Array<SGMAnalytics.MentorEntry>),
        withoutAccompaniments: ([] as Array<SGMAnalytics.MentorEntry>)
    });
    const { withAccompaniments, withoutAccompaniments } = groups;

    this.mentorsWithoutAccompaniments = withoutAccompaniments;
    this.mentorsWithAccompaniments = withAccompaniments;
  }

  /**
   * Calculate degrees registered
   */
  private calculateDegreeFilter(): void {
    const degrees = this.sourceMentors.map(m => m.degree);
    const uniqueDegrees = [...new Map(degrees.map(d => [d.id, d])).values()];
    const sorted = uniqueDegrees.sort((curr, next) => curr.name.localeCompare(next.name));
    this.filterOptions = sorted;
  }

  /**
   * Filter mentors by degree
   * @param selection name of the degree selected
   */
  public applyFilter(selection: string | null) {
    this.filter = selection;
    this.groupMentorsByAccompaniments();
  }

  public get percentageMentorsWithAccompaniments(): string {
    const total = this.mentors.length;
    const withAccompaniment = this.mentorsWithAccompaniments.length;
    const percentage = withAccompaniment * 100 / total;
    return percentage.toFixed(2);
  }

  public get percentageMentorsWithoutAccompaniments(): string {
    const total = this.mentors.length;
    const withoutAccompaniment = this.mentorsWithoutAccompaniments.length;
    const percentage = withoutAccompaniment * 100 / total;
    return percentage.toFixed(2);
  }
}
