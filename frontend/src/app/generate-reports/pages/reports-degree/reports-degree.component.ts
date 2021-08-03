import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {DegreesService} from '../../../core/services/degrees.service';
import {ExportToPdfService} from '../../../core/services/export-to-pdf.service';
import {AccompanimentsService} from '../../../core/services/accompaniments.service';
import {MentorsService} from '../../../core/services/mentors.service';
import {StudentsService} from '../../../core/services/students.service';
import {UserService} from '../../../core/services/user.service';
import {SGMAcademicDegree, SGMAccompaniment, SGMMentor, SGMStudent} from '@utpl-rank/sgm-helpers';
import {Subscription} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {UserSignature} from '../../../models/user';
import {take} from "rxjs/operators";

export interface MentorAndStudents {
  students: Array<Array<SGMStudent.readDTO>>;
  mentor: SGMMentor.readDTO;
  accompaniments: Array<Array<SGMAccompaniment.readDTO>>;
  signature: string | undefined;
}

export interface StudentsAndAccompaniments {
  student: SGMStudent.readDTO;
  accompaniments: Array<SGMAccompaniment.readDTO>;
}

type StudentWithAccompanimentsDto = {
  student: SGMStudent.readDTO;
  accompaniments: Array<SGMAccompaniment.readDTO>
};

type MentorWithInformation = {
  mentor: SGMMentor.readDTO;
  studentsWithAccompaniments: Array<StudentWithAccompanimentsDto>;
  signature: UserSignature | null;
};

type Doc<T> = Promise<{ data: T }>;
type Collection<T> = Promise<{ data: Array<T> }>;

@Component({
  selector: 'sgm-reports-degree',
  templateUrl: './reports-degree.component.html',
  styles: []
})
export class ReportsDegreeComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly degreesService: DegreesService,
    private readonly exportToPdfService: ExportToPdfService,
    private readonly accompanimentsService: AccompanimentsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly userService: UserService,
  ) {
  }

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER: string | undefined;
  public i = 0;

  public mentorsWithInformation: Array<MentorWithInformation> = [];
  public studentsWithAccompanimentsDto!: StudentWithAccompanimentsDto;

  public degree!: SGMAcademicDegree.readDTO | null;
  public accompaniments: Array<Array<SGMAccompaniment.readDTO>> = [];
  public accompanimentsSubs: Subscription[] = [];
  public accompanimentsDegree: Array<Array<Array<SGMAccompaniment.readDTO>>> = [];
  public accompanimentsByStudent: Array<Array<SGMAccompaniment.readDTO>> = [];
  public mentorAndStudents: Array<MentorAndStudents> = [];
  public studentsAndAccompaniments: Array<StudentsAndAccompaniments> = [];
  public studentAndAccompaniments!: StudentsAndAccompaniments;
  public aMentorAndStudents!: MentorAndStudents;
  public students: Array<Array<SGMStudent.readDTO>> = [];
  public studentsByMentor: Array<SGMStudent.readDTO> = [];
  public mentors: Array<SGMMentor.readDTO> = [];
  public signatures: Array<string | undefined> = [];

  private degreeSubscription!: Subscription;
  private accompanimentsSubscription!: Subscription;
  private mentorSubscription!: Subscription;
  private studentsSubscription!: Subscription;
  private userSubscription!: Subscription;
  private paramsSubscription!: Subscription;

  ngOnInit(): void {

    this.paramsSubscription = this.route.params.subscribe(
      async (params: Params) => {
        const degreeId = params.degreeId;
        const periodId = params.periodId;
        this.degreesService.degreeStream(degreeId).subscribe(
          async value => {
            this.degree = await value;
            this.TYPE_COVER = this.degree?.name;
          }
        );
        this.mentorsWithInformation = await this.mentorsOfDegree(periodId, degreeId).then();
      }
    );

  }

  async mentorsOfDegree(periodId: string, degreeId: string) {

    const mentorsOnly = await this.mentorsService.getMentorsOfDegree(periodId, degreeId)
      .pipe(take(1)).toPromise().then();

    return await Promise.all(
      mentorsOnly.map(async mentor => {
        const signatureMentorId = mentor.id.split('-')[2];
        const signature: UserSignature | null = await this.userService.signatureOf(signatureMentorId)
          .pipe(take(1)).toPromise().then();

        const students: Array<SGMStudent.readDTO> = await this.studentsService.getStudentsOfMentor(mentor.id)
          .pipe(take(1)).toPromise().then();

        const studentsWithAccompaniments = await Promise.all(
          students.map(async student => {
            const accompaniments: Array<SGMAccompaniment.readDTO> = await this.accompanimentsService.accompaniments({
              orderBy: {timeCreated: 'asc'},
              where: {studentId: student.id}
            }).pipe(take(1)).toPromise().then();
            const studentWithAccompanimentsDto: StudentWithAccompanimentsDto = {
              student,
              accompaniments
            };
            return studentWithAccompanimentsDto;
          }));

        const mentorsWithAllInformation: MentorWithInformation = {
          mentor,
          studentsWithAccompaniments,
          signature
        };
        return mentorsWithAllInformation;
      }));
  }
}
