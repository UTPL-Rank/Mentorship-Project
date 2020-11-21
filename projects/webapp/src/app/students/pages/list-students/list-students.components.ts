import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';
import { AcademicPeriod, Mentor, Students } from '../../../models/models';
import { ListStudentsQuery } from './list-students-query.interface';

@Component({
    selector: 'sgm-list-students',
    templateUrl: './list-students.component.html'
})
export class ListStudentsComponent implements OnInit {
    constructor(
        private readonly title: TitleService,
        private readonly route: ActivatedRoute,
        private readonly mentorsService: MentorsService,
        private readonly studentsService: StudentsService,
        public readonly auth: UserService,
    ) { }

    private params: Observable<{ periodId?: string }> = this.route.params;
    private query: Observable<ListStudentsQuery> = this.route.queryParams;

    public readonly mentor$: Observable<Mentor | null> = this.query.pipe(
        switchMap(({ mentorId }) => !!mentorId ? this.mentorsService.mentorStream(mentorId) : of(null)),
        shareReplay(1),
    );

    public isPeriodActiveObs = this.route.data.pipe(
        map(d => (d.activePeriod as AcademicPeriod).current)
    );

    public readonly students$: Observable<Students> = combineLatest([this.query, this.params]).pipe(
        switchMap(([query, params]) => this.studentsService.list$({ periodId: params.periodId, mentorId: query.mentorId, limit: 20 })),
    );

    public readonly showMentorName$: Observable<boolean> = this.mentor$.pipe(
        map(m => !m)
    );

    ngOnInit() {
        this.title.setTitle('Estudiantes');
    }
}