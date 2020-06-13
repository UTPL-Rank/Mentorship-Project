import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, Student } from '../../../models/models';
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

@Component({
  selector: 'sgm-generate-student-report',
  templateUrl: './generate-student-report.component.html'
})

export class GenerateStudentReportComponent {
  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly studentsService: StudentsService,
    private readonly router: Router,
  ) { }

  public readonly studentObs: Observable<Student> = this.route.params
    .pipe(
      switchMap(params => this.studentsService.getStudentObsAndShare(params.studentId)),
      tap(student => this.title.setTitle(`Ficha del Estudiante | ${student.displayName.toUpperCase()}`)),
    );

  public readonly periodObs: Observable<AcademicPeriod> = this.route.data
    .pipe(map(d => d.activePeriod));

  @ViewChild(SigCanvasComponent)
  public readonly sigCanvas: SigCanvasComponent;

  export(mentorId: string, studentId: string, semesterId: string) {
    const url =
      'https://us-central1-sgmentores.cloudfunctions.net/exportToPdf?' +
      `mentorId=${mentorId}&` +
      `studentId=${studentId}&` +
      `semesterId=${encodeURIComponent(semesterId)}&` +
      `signature=${encodeURIComponent(this.sigCanvas.getDataURL())}`;

    window.open(url, '_blank');
  }

  navigate(mentorId: string, studentId: string, semesterId: string) {
    if (this.sigCanvas.isCanvasBlank()) {
      alert('Debe ingresar una firma.');
      return;
    }

    this.router.navigate(
      [
        '/panel-control',
        'ficha-acompañamiento',
        mentorId,
        studentId,
        semesterId
      ],
      {
        queryParams: {
          signature: this.sigCanvas.getDataURL()
        }
      }
    );
  }

}