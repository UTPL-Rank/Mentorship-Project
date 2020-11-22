import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { Mentors } from '../../../models/models';
import { ListStudentsQuery } from '../../../students/pages/list-students/list-students-query.interface';

@Component({
    selector: 'sgm-mentor-filter-selector',
    template: `
        <select [formControl]="selectMentorControl" class="custom-select">
            <option [value]="null" default>Filtrar por mentor</option>
            <ng-container *ngFor="let mentor of mentors$|async">
                <option [value]="mentor.id">{{mentor.displayName | titlecase}}</option>
            </ng-container>
        </select>
    `
})
export class MentorFilterSelectorComponent implements OnInit, OnDestroy {

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly mentorsService: MentorsService,
        private readonly fb: FormBuilder,
    ) { }

    public readonly selectMentorControl: FormControl = this.fb.control([null]);

    private selectedValueChanged: Subscription;
    private routeMentorIdChanged: Subscription;

    public readonly mentors$: Observable<Mentors> = this.route.params.pipe(
        switchMap(({ periodId }) => this.mentorsService.getAllMentorsAndShare(periodId)),
        shareReplay(1),
    );

    private readonly mentorId$: Observable<string> = this.route.queryParams.pipe(
        map(({ mentorId }: ListStudentsQuery) => mentorId || 'null'),
        shareReplay(1),
    );

    ngOnInit() {
        this.routeMentorIdChanged = this.mentorId$.subscribe(mentorId => {
            this.selectMentorControl.setValue(mentorId);
        });

        this.selectedValueChanged = this.selectMentorControl.valueChanges.subscribe(async id => {

            const queryParams: ListStudentsQuery = id === 'null' ? {} : { mentorId: id };

            await this.router.navigate([], {
                queryParams,
                relativeTo: this.route
            });
        });
    }

    ngOnDestroy(): void {
        this.selectedValueChanged.unsubscribe();
        this.routeMentorIdChanged.unsubscribe();
    }
}
