import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color } from 'ng2-charts';
import { Analytics } from 'projects/webapp/src/app/models/analytics';

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
    private sourceMentors: null | Array<Analytics.Mentor>;

    /**
     * mentors that has been already filtered
     */
    public mentors: null | Array<Analytics.Mentor>;

    /**
     * calculated data of the mentors with accompaniments
     */
    public mentorsWithAccompaniments: null | Array<Analytics.Mentor>;

    /**
     * calculated data of the mentors without accompaniments
     */
    public mentorsWithoutAccompaniments: null | Array<Analytics.Mentor>;

    /**
     * academic degrees that can be used to filter data
     */
    public filterOptions: null | Array<{ name: string, id: string }>;

    /**
     * filter information visualized
     */
    private filter: string | null;

    /**
     * chat options
     */
    public chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: ['white', 'black'],
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
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
        borderColor: ['#1B6AE1', '#1B6AE1'],
        backgroundColor: ['#1B6AE1', 'transparent'],
    }];

    /**
     * input mentors data to the component and transform
     */
    @Input('data')
    set setDataMentors(mentors: null | Array<Analytics.Mentor>) {

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
            withAccompaniments: ([] as Array<Analytics.Mentor>),
            withoutAccompaniments: ([] as Array<Analytics.Mentor>)
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
