import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color } from 'ng2-charts';
import { Analytics } from 'projects/webapp/src/app/models/analytics';

@Component({
    selector: 'sgm-mentors-with-accompaniments',
    templateUrl: './mentors-with-accompaniments.component.html'
})
export class MentorsWithAccompanimentsComponent {

    /**
     * mentors data from the parent component
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

        console.table([mentors[0]]);

        // save new state of the data
        this.mentors = mentors;

        this.filterMentorsByAccompaniments();
        this.calculateDegreeFilter();
    }

    /**
     * Filter mentors
     *
     * @param mentors list of mentors analytics
     */
    private filterMentorsByAccompaniments(): void {
        const filteredMentors = !!this.filter ? this.mentors.filter(m => m.degree.id === this.filter) : this.mentors;

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

    private calculateDegreeFilter(): void {
        const degrees = this.mentors.map(m => m.degree);
        const uniqueDegrees = [...new Map(degrees.map(d => [d.id, d])).values()];
        const sorted = uniqueDegrees.sort((curr, next) => curr.name.localeCompare(next.name));
        this.filterOptions = sorted;
    }

    public applyFilter(selection: string | null) {
        this.filter = selection;
        this.filterMentorsByAccompaniments();
    }
}
