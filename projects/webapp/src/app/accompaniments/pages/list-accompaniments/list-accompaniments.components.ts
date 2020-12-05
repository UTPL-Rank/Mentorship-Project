import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { AcademicPeriod, Accompaniment, Mentor, Student } from '../../../models/models';
import { ExportAccompanimentsCSVService } from '../../services/export-accompaniments-csv.service';
import { ListAccompanimentsQuery } from './list-accompaniments-query.interface';

@Component({
    selector: 'sgm-list-accompaniments',
    templateUrl: './list-accompaniments.component.html'
})
export class ListAccompanimentsComponent implements OnInit, OnDestroy {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly mentorsService: MentorsService,
        private readonly studentsService: StudentsService,
        private readonly accompanimentsService: AccompanimentsService,
        public readonly auth: UserService,
        private readonly csv: ExportAccompanimentsCSVService,
    ) { }

    private exportSub: Subscription | null = null;

    private params: Observable<{ periodId?: string }> = this.route.params;
    private query: Observable<ListAccompanimentsQuery> = this.route.queryParams;

    public readonly student$: Observable<Student | null> = this.query.pipe(
        switchMap(({ studentId }) => !!studentId ? this.studentsService.student(studentId) : of(null)),
        shareReplay(1),
    );

    public readonly mentor$: Observable<Mentor | null> = this.query.pipe(
        switchMap(({ mentorId, studentId }) => !!mentorId && !studentId ? this.mentorsService.mentorStream(mentorId) : of(null)),
        shareReplay(1),
    );

    public isPeriodActiveObs = this.route.data.pipe(
        map(d => (d.activePeriod as AcademicPeriod).current)
    );

    public readonly accompaniments$: Observable<Accompaniment[]> = combineLatest([this.query, this.params]).pipe(
        switchMap(([query, params]) =>
            this.accompanimentsService.accompanimentsStream({
                where: { periodId: params.periodId, mentorId: query.mentorId }, limit: 30, orderBy: { timeCreated: "desc" }
            }) as Observable<Accompaniment[]>),
        shareReplay(1),
    );

    public readonly showMentorName$: Observable<boolean> = this.mentor$.pipe(
        map(m => !m)
    );

    get disabledButton() {
        return !!this.exportSub;
    }


    ngOnInit() {

    }

    ngOnDestroy() {
        this.exportSub?.unsubscribe();
    }

    public exportCSV() {
      this.exportSub = this.csv.export$().subscribe(completed => {
            if (!completed)
                alert('Ocurrió un error al exportar los estudiantes');

            this.exportSub.unsubscribe();
            this.exportSub = null;
        });
    }
}
