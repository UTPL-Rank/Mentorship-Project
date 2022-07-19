import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcademicAreasService } from '../../../core/services/academic-areas.service';
import {SGMAcademicArea, SGMAcademicDegree, SGMAccompaniment, SGMMentor, SGMStudent} from '@utpl-rank/sgm-helpers';
import {DegreesService} from '../../../core/services/degrees.service';
import {take} from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { UserSignature } from 'src/app/models/user';
import { UserService } from '../../../core/services/user.service';
import { StudentsService } from '../../../core/services/students.service';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { ExportToPdfLargeService } from 'src/app/core/services/export-to-pdf-large.service';

type StudentWithAccompanimentsDto = {
  student: SGMStudent.readDTO;
  accompaniments: Array<SGMAccompaniment.readDTO>
};

type MentorWithInformation = {
  mentor: SGMMentor.readDTO;
  studentsWithAccompaniments: Array<StudentWithAccompanimentsDto>;
  signature: UserSignature | null;
};

@Component({
  selector: 'sgm-reports-area',
  templateUrl: './reports-area.component.html',
  styles: [
  ]
})
export class ReportsAreaComponent implements OnInit {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER: string | undefined;

  public studentsWithAccompanimentsDto!: StudentWithAccompanimentsDto;
  public mentorsWithInformation: Array<MentorWithInformation> = [];

  public periodId!: string;
  public areaId!: string;
  public area!: SGMAcademicArea.readDTO;
  public degreesOfArea!: Array<SGMAcademicDegree.readDTO>;

  private paramsSubscription!: Subscription;
  private academicAreasSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly academicAreasService: AcademicAreasService,
    private readonly degreesService: DegreesService,
    private readonly mentorsService: MentorsService,
    private readonly userService: UserService,
    private readonly studentService: StudentsService,
    private readonly accompanimentsService: AccompanimentsService,
    private readonly exportToPdfServiceLarge: ExportToPdfLargeService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      async (params: Params) => {
        this.periodId = params.periodId;
        this.areaId = params.areaId;
        this.area = await this.academicAreasService.areaStream(this.areaId).pipe(take(1)).toPromise().then();
        this.TYPE_COVER = this.area.name;
        this.degreesOfArea = await this.degreesService.getDegreesOfArea(this.area.id).pipe(take(1)).toPromise().then();
        this.mentorsWithInformation = await this.mentorsOfArea(this.periodId, this.areaId).then();
      }
    );

  }

  async mentorsOfArea(periodId: string, areaId: string) {
    const mentorsOnly = await this.mentorsService.getMentorsOfArea(periodId, areaId)
      .pipe(take(1)).toPromise().then();

    return await Promise.all(
      mentorsOnly.map(async mentor => {
        const signatureMentorId = mentor.id.split('-')[2];
        const signature: UserSignature | null = await this.userService.signatureOf(signatureMentorId)
          .pipe(take(1)).toPromise().then();

        const students: Array<SGMStudent.readDTO> = await this.studentService.getStudentsOfMentor(mentor.id)
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
          })
        );
        const mentorsWithAllInformation: MentorWithInformation = {
          mentor,
          studentsWithAccompaniments,
          signature
        };
        return mentorsWithAllInformation;
      })
    );
  }

  toPdfLarge(): void {
    // @ts-ignore
    const content: Element = document.getElementById('content');
    const area = this.area?.name;
    if (!area) this.exportToPdfServiceLarge.createPdfs(area);
    if (area) this.exportToPdfServiceLarge.createPdfs(area);
  }
}
