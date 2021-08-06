import {Component, OnDestroy, OnInit} from '@angular/core';
import { ExportToPdfService } from '../../../core/services/export-to-pdf.service';
import { SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { Subscription } from 'rxjs';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'sgm-reports-student',
  templateUrl: './reports-student.component.html',
  styles: [
  ]
})
export class ReportsStudentComponent implements OnInit, OnDestroy {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER = 'Estudiante de primer ciclo';

  public accompaniments!: SGMAccompaniment.readDTO[];
  public student!: SGMStudent.readDTO;
  public mentor!: SGMMentor.readDTO;
  public signature!: string | undefined;

  private accompanimentsSubscription!: Subscription;
  private mentorSubscription!: Subscription;
  private studentSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(
    private readonly exportToPdfService: ExportToPdfService,
    private readonly accompanimentsService: AccompanimentsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
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
          { timeCreated: 'asc' },
        where:
          { studentId: studentIdParam }
      }
    ).subscribe(
      async values => this.accompaniments = values as Array<SGMAccompaniment.readDTO>
    );

    this.mentorSubscription = this.mentorsService.mentor(mentorIdParam).subscribe(
      async value => this.mentor = await value as SGMMentor.readDTO
    );

    this.studentSubscription = this.studentsService.studentStream(studentIdParam).subscribe(
      async value => this.student = await value as SGMStudent.readDTO
    );

    const signatureMentorId = mentorIdParam.split('-')[2];
    this.userSubscription = this.userService.signatureOf(signatureMentorId).subscribe(
      async result => this.signature = await result?.data as string
    );
  }

  toPdf(): void {
    // @ts-ignore
    const content: Element = document.getElementById('content');
    this.exportToPdfService.generate(this.student.id, content);
  }

  ngOnDestroy(): void{
  this.accompanimentsSubscription.unsubscribe();
  this.mentorSubscription.unsubscribe();
  this.studentSubscription.unsubscribe();
  this.userSubscription.unsubscribe();
  }

}
