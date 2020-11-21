import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { AcademicPeriod, Mentor, Mentors, Students } from '../../../models/models';
import { ExportStudentsCSVService } from '../../services/export-students-csv.service';
import { ListStudentsQuery } from './list-students-query.interface';

@Component({
    selector: 'sgm-list-students',
    templateUrl: './list-students.component.html'
})
export class ListStudentsComponent implements OnInit, OnDestroy {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly mentorsService: MentorsService,
        private readonly studentsService: StudentsService,
        public readonly auth: UserService,
        public readonly csv: ExportStudentsCSVService,
        public readonly fb: FormBuilder,
    ) { }

    private exportSub: Subscription | null = null;
    private filterSub: Subscription = null;

    private params: Observable<{ periodId?: string }> = this.route.params;
    private query: Observable<ListStudentsQuery> = this.route.queryParams;

    public readonly mentors$: Observable<Mentors> = this.params.pipe(
        switchMap(({ periodId }) => this.mentorsService.getAllMentorsAndShare(periodId)),
        shareReplay(1),
    );

    public readonly mentor$: Observable<Mentor | null> = this.query.pipe(
        switchMap(({ mentorId }) => !!mentorId ? this.mentorsService.mentorStream(mentorId) : of(null)),
        shareReplay(1),
    );

    public isPeriodActiveObs = this.route.data.pipe(
        map(d => (d.activePeriod as AcademicPeriod).current)
    );

    public readonly students$: Observable<Students> = combineLatest([this.query, this.params]).pipe(
        switchMap(([query, params]) => this.studentsService.list$({ periodId: params.periodId, mentorId: query.mentorId, limit: 50 })),
        shareReplay(1),
    );

    public readonly showMentorName$: Observable<boolean> = this.mentor$.pipe(
        map(m => !m)
    );

    get disabledButton() {
        return !!this.exportSub;
    }

    public selectMentorControl: FormControl;

    ngOnInit() {
        const { mentorId = null } = this.route.snapshot.queryParams as ListStudentsQuery;
        this.selectMentorControl = this.fb.control([mentorId]);

        this.filterSub = this.selectMentorControl.valueChanges.subscribe(async id => {

            const queryParams: ListStudentsQuery = id === 'null' ? {} : { mentorId: id };

            await this.router.navigate([], {
                queryParams,
                relativeTo: this.route
            });
        });
    }

    ngOnDestroy() {
        this.exportSub?.unsubscribe();
        this.filterSub.unsubscribe();
    }

    public exportCSV() {
        const exportTask = this.students$.pipe(
            switchMap(students => this.csv.export$(students)),
        );
        this.exportSub = exportTask.subscribe(completed => {
            if (!completed)
                alert('Ocurrió un error al exportar los estudiantes');

            this.exportSub.unsubscribe();
            this.exportSub = null;
        });
    }
}
