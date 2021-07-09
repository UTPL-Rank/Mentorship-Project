import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {SGMAccompaniment, SGMMentor, SGMStudent} from '@utpl-rank/sgm-helpers';

import {AccompanimentsService} from '../../../core/services/accompaniments.service';
import {MentorsService} from '../../../core/services/mentors.service';
import {StudentsService} from '../../../core/services/students.service';
import {UserService} from '../../../core/services/user.service';

// @ts-ignore
import * as html2pdf from 'html2pdf.js';

import {Observable, Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'sgm-student-report',
  templateUrl: './student-report.component.html',
  styles: []
})
export class StudentReportComponent implements OnInit, OnDestroy {

  TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';

  // data
  public accompaniments!: SGMAccompaniment.readDTO[];
  public student!: SGMStudent.readDTO;
  public mentor!: SGMMentor.readDTO;
  public semesterKind!: SGMAccompaniment.SemesterType;
  public signature!: string | undefined;

  accompanimentsSubscription!: Subscription;
  mentorSubscription!: Subscription;
  studentSubscription!: Subscription;
  userSubscription!: Subscription;

  constructor(
    private readonly accompanimentsService: AccompanimentsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly userService: UserService,
    private route: ActivatedRoute,
  ) {
  }

  @ViewChild('content') content!: ElementRef;

  ngOnInit(): void {
    this.semesterKind = 'sgm#secondSemester';

    let mentorIdParam = '';
    let studentIdParam = '';
    this.route.params.subscribe((params: Params) => {
        mentorIdParam = params.mentorId;
        studentIdParam = params.studentId;
      }
    );

    this.accompanimentsSubscription = this.accompanimentsService.accompanimentsStream(
      {
        orderBy:
          {timeCreated: 'asc'},
        where:
          {
            studentId: studentIdParam,
          }
      }
    ).subscribe(
      async values => this.accompaniments = await values
    );

    this.mentorSubscription = this.mentorsService.mentor(mentorIdParam).subscribe(
      async value => this.mentor = await value
    );

    this.studentSubscription = this.studentsService.studentStream(studentIdParam).subscribe(
      async value => this.student = await value
    );

    const signatureMentorId = mentorIdParam.split('-')[2];
    this.userSubscription = this.userService.signatureOf(signatureMentorId).subscribe(
      async result => this.signature = await result?.data
    );

    console.log(this.signature);

  }

  get academicPeriod() {
    if (!!this.accompaniments && this.accompaniments.length > 0)
      return this.accompaniments[0].period.name;

    return '';
  }

  toPdf(): void {
    const filename = `${this.student.id}.pdf`;
    const options = {
      margin: 1 ,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        fontSize: 5
      },
      pagebreak: { mode: 'avoid-all', before: '.report-student-content' }
    };

    // @ts-ignore
    const content: Element = document.getElementById('content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

  ngOnDestroy() {
    this.accompanimentsSubscription.unsubscribe();
    this.studentSubscription.unsubscribe();
    this.mentorSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
