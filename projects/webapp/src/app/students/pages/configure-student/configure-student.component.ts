import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, Mentor, Student } from '../../../models/models';

@Component({
  selector: 'sgm-configure-student',
  templateUrl: './configure-student.component.html'
})

export class ConfigureStudentComponent implements OnDestroy {
  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly studentsService: StudentsService,
    private readonly mentorsService: MentorsService,
    private readonly fb: FormBuilder,
  ) { }

  private transferStudentSub: Subscription | null = null;

  public readonly changeMentorForm: FormGroup = this.fb.group({
    newMentor: [null, Validators.required]
  });

  public readonly student$: Observable<Student> = this.route.params
    .pipe(
      switchMap(params => this.studentsService.studentStream(params.studentId)),
      tap(student => this.title.setTitle(`Ficha del Estudiante | ${student.displayName.toUpperCase()}`)),
    );

  public readonly periodObs: Observable<AcademicPeriod> = this.route.data.pipe(
    map(d => d.activePeriod),
  );

  public readonly mentors$: Observable<Array<Mentor>> = this.periodObs.pipe(
    switchMap(period => combineLatest([this.student$, this.mentorsService.getAllMentorsAndShare(period.id)])),
    map(([student, mentors]) => mentors.filter(m => m.id !== student.mentor.reference.id)),
    shareReplay(1),
  );

  public ngOnDestroy(): void {
    this.transferStudentSub?.unsubscribe();
  }

  get transferButtonDisabled(): boolean {
    return this.changeMentorForm.invalid || !!this.transferStudentSub;
  }

  get transferButtonText(): string {

    if (!!this.changeMentorForm.invalid)
      return 'Selecciona un mentor';

    if (!!this.transferStudentSub)
      return 'Actualizando...';

    return 'Transferir estudiante';
  }

  public changeStudentMentor() {
    const { invalid, value } = this.changeMentorForm;

    if (!!this.transferStudentSub)
      return;

    if (invalid) {
      alert('Formulario Incorrecto, selecciona un mentor valido');
      return;
    }

    const newMentorId = value.newMentor;

    const transferTask = this.student$.pipe(
      take(1),
      switchMap(student => this.studentsService.transferStudentMentor$({ newMentorId, studentId: student.id }))
    );

    this.transferStudentSub = transferTask.subscribe(updated => {
      const message = updated ? 'Se actualizo correctamente el estudiante.' : 'Ocurrió un error, vuelve a intentarlo.';
      alert(message);
      this.transferStudentSub?.unsubscribe();
      this.transferStudentSub = null;
    });
  }

}
