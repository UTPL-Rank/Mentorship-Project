import { Component, Input } from '@angular/core';

@Component({
    selector: 'sgm-mentors-with-accompaniments',
    templateUrl: './mentors-with-accompaniments.component.html'
})

export class MentorsWithAccompanimentsComponent {

    @Input('data')
    set setDataMentors(mentors: any) {
        this.mentors = mentors;
        console.log(mentors);
    }

    public mentorsWithAccompaniments: null | Array<any>;
    public mentorsWithoutAccompaniments: null | Array<any>;

    private mentors: null | Array<any>;
}
