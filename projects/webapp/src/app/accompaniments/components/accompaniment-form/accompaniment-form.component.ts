import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';
import { Students } from '../../../models/models';
import { SaveAccompanimentService } from '../services/save-accompaniment.service';



@Component({
  selector: 'sgm-accompaniment-form',
  templateUrl: './accompaniment-form.component.html'
})
export class AccompanimentFormComponent implements OnDestroy {
  constructor(
    private readonly fb: FormBuilder,
    private readonly saveAccompaniment: SaveAccompanimentService,
    private readonly router: Router,
  ) { }

  @Input()
  students: Students;

  @Input()
  mentorId: string;

  private selectedStudentId: string | null = null;

  private savingSubscription: Subscription | null;

  // before setting `selectedStudentId`, validate it exist within the students
  @Input('selectedStudentId')
  set setSelectedStudentId(selectedStudentId: string | null) {
    const valid = this.students.map(s => s.id).includes(selectedStudentId);
    if (valid)
      this.selectedStudentId = selectedStudentId;
  }

  private noProblemsAccompaniment: FormControl = this.fb.control(false);

  public accompanimentForm: FormGroup = this.fb.group({
    studentId: [this.selectedStudentId, Validators.required],

    semesterKind: [null, Validators.required],
    followingKind: [null, Validators.required],

    problemDescription: [null, Validators.required],
    solutionDescription: [null, Validators.required],

    important: [false],

    problems: this.fb.group({
      none: this.noProblemsAccompaniment,
      academic: [false],
      administrative: [false],
      economic: [false],
      psychosocial: [false],
    }),
  });



  private validated = false;
  private files: File[] = [];

  public readonly showProblemsOptions$ = this.noProblemsAccompaniment.valueChanges.pipe(
    map(noProblemsFound => !noProblemsFound),
    tap(hasProblems => {
      if (hasProblems) {
        this.accompanimentForm.addControl('problemDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.addControl('solutionDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.removeControl('topicDescription');
        this.accompanimentForm.removeControl('topic');
      } else {
        this.accompanimentForm.removeControl('problemDescription');
        this.accompanimentForm.removeControl('solutionDescription');
        this.accompanimentForm.addControl('topicDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.addControl('topic', this.fb.control(null, Validators.required));
      }
    }),
    shareReplay(1),
    startWith(true),
  );

  ngOnDestroy(): void {
    this.savingSubscription?.unsubscribe();
  }

  save(): void {
    this.validated = true;

    if (!!this.savingSubscription)
      return;


    if (!this.valid) {
      alert('El formulario es invalido');
      return null;
    }
    const { value } = this.accompanimentForm;

    this.savingSubscription = this.saveAccompaniment.save(this.mentorId, value, this.files).subscribe(
      async createdAccompaniment => {
        if (createdAccompaniment) {
          alert('Todos los cambios están guardados');

          await this.router.navigate([
            'panel-control',
            createdAccompaniment.period.reference.id,
            'ver-acompañamiento',
            createdAccompaniment.mentor.reference.id,
            createdAccompaniment.id
          ]);

        } else
          alert('Ocurrió un error al guardar la información');

        this.savingSubscription.unsubscribe();
        this.savingSubscription = null;
      }
    );
  }

  onFileChange(event) {
    const files: FileList = event.target.files;
    this.files = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  get disableButton() {
    return !!this.savingSubscription;
  }

  get valid() {
    return this.accompanimentForm.valid && this.isProblemsValid;
  }

  get isStudentIdInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.studentId;
    return invalid && (touched || this.validated);
  }
  get showProblemsInvalid() {
    return !this.isProblemsValid && this.validated;
  }

  get isTopicDescriptionInvalid() {
    const {
      invalid,
      touched
    } = this.accompanimentForm.controls.topicDescription;
    return invalid && (touched || this.validated);
  }

  get isProblemDescriptionInvalid() {
    const {
      invalid,
      touched
    } = this.accompanimentForm.controls.problemDescription;
    return invalid && (touched || this.validated);
  }

  get isSolutionDescriptionInvalid() {
    const {
      touched,
      invalid
    } = this.accompanimentForm.controls.solutionDescription;
    return invalid && (touched || this.validated);
  }

  get filesNames() {
    return this.files.map(f => f.name);
  }

  get isSemesterKindInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.semesterKind;
    return invalid && (touched || this.validated);
  }

  get isTypeOfFollowInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.followingKind;
    return invalid && (touched || this.validated);
  }

  get isProblemsValid() {
    const {
      academic,
      administrative,
      economic,
      psychosocial,
      otherDescription,
      none
    } = this.accompanimentForm.controls.problems.value;

    return (
      !!academic ||
      !!administrative ||
      !!economic ||
      !!psychosocial ||
      !!none ||
      !!otherDescription
    );
  }
}
