import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, Mentor, Students } from '../../../models/models';
import { MentorsService } from '../../services/mentors.service';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'sgm-mentor-profile-page',
  templateUrl: './mentor-profile-page.component.html'
})
export class MentorProfilePageComponent implements OnInit {
  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService
  ) { }

  public students: Observable<Students> = this.route.params.pipe(
    switchMap(params => this.studentsService.allStudents(params))
  );

  public mentor: Observable<Mentor> = this.route.params.pipe(
    switchMap(params => this.mentorsService.getMentor(params.mentorId)),
    tap(mentor => this.title.setTitle(mentor.displayName.toUpperCase())),
  );

  public period: Observable<AcademicPeriod> = this.route.data.pipe(
    map(d => d.activePeriod)
  );

  ngOnInit() { }

}
