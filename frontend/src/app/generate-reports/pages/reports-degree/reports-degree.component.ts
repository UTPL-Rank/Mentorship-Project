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

@Component({
  selector: 'sgm-reports-degree',
  templateUrl: './reports-degree.component.html',
  styles: []
})
export class ReportsDegreeComponent implements OnInit {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER: string | undefined;
  public i = 0;

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

  ngOnInit(): void {
    let degreeId = '';
    let periodId = '';

    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        degreeId = params.degreeId;
        periodId = params.periodId;
        // Consigo los mentores de una titulación
        this.mentorsService.getMentorsOfDegree(periodId, degreeId).subscribe(
          values => {
            this.mentors = values as Array<SGMMentor.readDTO>;
            this.mentors.forEach(mentor => {
              const signatureMentorId = mentor.id.split('-')[2];
              this.userService.signatureOf(signatureMentorId).subscribe(
                result => this.signatures.push(result?.data as string)
              );
            });

            this.mentors.forEach(mentor => {
              this.studentsService.getStudentsOfMentor(mentor.id).subscribe(
                async (students) => {
                  this.students.push(students as Array<SGMStudent.readDTO>);
                  this.accompanimentsSubs = students.map(
                    student => this.accompanimentsService.accompanimentsStream(
                        {
                          orderBy: { timeCreated: 'asc' },
                          where: { studentId: student.id }
                        }
                      ).subscribe()
                  );
                  students.forEach(student => {
                    this.accompanimentsService.accompanimentsStream(
                      {
                        orderBy: {timeCreated: 'asc'},
                        where: {studentId: student.id}
                      }
                    ).subscribe(
                      accompaniments => {
                        this.accompaniments.push(accompaniments as Array<SGMAccompaniment.readDTO>);
                        return accompaniments;
                      }
                    );
                  });
                }
              );
            });

            // this.mentors.forEach(mentor => {
            //   this.aMentorAndStudents.mentor = mentor;
            //   // Consigo los estudiantes de cada mentor
            //   this.studentsSubscription = this.studentsService.getStudentsOfMentor(mentor.id).subscribe(
            //     async students => {
            //       this.aMentorAndStudents.students.push(students as Array<SGMStudent.readDTO>);
            //       students.forEach(student => {
            //         // Consigo los acompañamientos de cada estudiante
            //         this.accompanimentsSubscription = this.accompanimentsService.accompanimentsStream(
            //           {
            //             orderBy:
            //               { timeCreated: 'asc' },
            //             where:
            //               { studentId: student.id }
            //           }
            //         ).subscribe(
            //           accompaniments => this.aMentorAndStudents.accompaniments.push(accompaniments as Array<SGMAccompaniment.readDTO>)
            //         );
            //       });
            //     }
            //   );
            //   this.mentorAndStudents.push(this.aMentorAndStudents);
            // });

            // this.mentors.forEach(mentor => {
            //   this.studentsSubscription = this.studentsService.getStudentsOfMentor(mentor.id).subscribe(
            //     students => {
            //       this.students.push(students as Array<SGMStudent.readDTO>);
            //       students.forEach(student => {
            //         this.accompanimentsSubscription = this.accompanimentsService.accompanimentsStream(
            //           {
            //             orderBy:
            //               { timeCreated: 'asc' },
            //             where:
            //               { studentId: student.id }
            //           }
            //         ).subscribe(
            //           accompaniments => {
            //             this.accompanimentsByStudent.push(accompaniments as Array<SGMAccompaniment.readDTO>);
            //             // console.log(accompaniments);
            //           }
            //         );
            //         // this.accompaniments.push(this.accompanimentsByMentor);
            //         // console.log(this.accompanimentsByMentor.length);
            //       });
            //     }
            //   );
            // });
          }
        );
      }
    );

    this.degreeSubscription = this.degreesService.degreeStream(degreeId).subscribe(
      async value => {
        this.degree = await value;
        this.TYPE_COVER = this.degree?.name;
      }
    );

  }

  getAccompaniments(): void {
    this.students.forEach(students => {

      students.forEach(student => {
          this.accompanimentsService.accompanimentsStream(
            {
              orderBy: {timeCreated: 'asc'},
              where: {studentId: student.id}
            }
          ).subscribe(
            accompaniments => this.accompaniments.push(accompaniments as Array<SGMAccompaniment.readDTO>)
          );
        }
      );

    });
  }

}
