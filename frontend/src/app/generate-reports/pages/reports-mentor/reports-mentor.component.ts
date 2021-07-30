import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExportToPdfService } from '../../../core/services/export-to-pdf.service';
import { SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import {Observable, of, Subscription} from 'rxjs';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'sgm-reports-mentor',
  templateUrl: './reports-mentor.component.html',
})
export class ReportsMentorComponent implements OnInit, OnDestroy {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER = 'Estudiante mentor';

  public accompaniments: Array<Array<SGMAccompaniment.readDTO>> = [];
  public students: Array<SGMStudent.readDTO> = [];
  public mentor!: SGMMentor.readDTO;
  public signature!: string | undefined;

  private accompanimentsSubscription!: Subscription;
  private mentorSubscription!: Subscription;
  private studentsSubscription!: Subscription;
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

    let mentorId = '';

    this.route.params.subscribe(
      (params: Params) => mentorId = params.mentorId
    );

    this.mentorSubscription = this.mentorsService.mentor(mentorId).subscribe(
      async value => {
        this.mentor = await value as SGMMentor.readDTO;
        this.studentsSubscription = await this.studentsService.getStudentsOfMentor(this.mentor.id).subscribe(
          async student => {
            this.students = await student as Array<SGMStudent.readDTO>;
            // tslint:disable-next-line:curly
            for (const s of this.students) {
              this.accompanimentsSubscription = await this.accompanimentsService.accompanimentsStream(
                {
                  orderBy:
                    { timeCreated: 'asc' },
                  where:
                    {
                      studentId: s.id,
                    }
                }
              ).subscribe(
                async values => this.accompaniments.push(values as Array<SGMAccompaniment.readDTO>)
              );
            }
          }
        );
      }
    );

    const signatureMentorId = mentorId.split('-')[2];
    this.userSubscription = this.userService.signatureOf(signatureMentorId).subscribe(
      async result => this.signature = await result?.data as string
    );

  }

  ngOnDestroy(): void{
    this.accompanimentsSubscription.unsubscribe();
    this.mentorSubscription.unsubscribe();
    this.studentsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  toPdf(): void {
    this.exportToPdfService.generate(this.mentor.id);
  }

}
