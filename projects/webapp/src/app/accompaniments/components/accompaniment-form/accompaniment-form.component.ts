import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';
import { Students } from '../../../models/models';

export interface AccompanimentFormValue {
  studentId: string;

  semesterKind: string;
  followingKind: string;
  problemDescription: string;
  solutionDescription: string;
  topicDescription: string;
  important: boolean;

  problems: {
    none: boolean;
    academic: boolean;
    administrative: boolean;
    economic: boolean;
    psychosocial: boolean;
    other: boolean;
    otherDescription: string;
    problemCount: number;
  };

  assets: File[];
}

@Component({
  selector: 'sgm-accompaniment-form',
  templateUrl: './accompaniment-form.component.html'
})
export class AccompanimentFormComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
  ) { }

  @Input()
  students: Students;

  @Input()
  mentorId: string;

  private selectedStudentId: string = null;

  // before setting `selectedStudentId`, validate it exist within the students
  @Input('selectedStudentId')
  set setSelectedStudentId(selectedStudentId: string) {
    const valid = this.students.map(s => s.id).includes(selectedStudentId);
    if (valid) {
      this.selectedStudentId = selectedStudentId;
    }
  }

  private noProblemsAccompaniment: FormControl = this.fb.control(false);

  public accompanimentForm: FormGroup = this.fb.group({
    studentId: [this.selectedStudentId, Validators.required],

    semesterKind: [null, Validators.required],
    followingKind: [null, Validators.required],
    problemDescription: [null, Validators.required],
    solutionDescription: [null, Validators.required],
    topicDescription: [null, Validators.required],
    important: [false],

    problems: this.fb.group({
      none: this.noProblemsAccompaniment,
      academic: [false],
      administrative: [false],
      economic: [false],
      psychosocial: [false],
      otherDescription: [null]
    }),
  });

  private validated = false;
  private files: File[] = [];

  public readonly showProblemsOptions$ = this.noProblemsAccompaniment.valueChanges.pipe(
    map(noProblemsFound => !noProblemsFound),
    tap(hasProblems => {
      if (hasProblems) {
        this.accompanimentForm.addControl('problemDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.addControl('topicDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.addControl('solutionDescription', this.fb.control(null, Validators.required));
        this.accompanimentForm.addControl('important', this.fb.control(false));
      } else {
        this.accompanimentForm.removeControl('problemDescription');
        this.accompanimentForm.removeControl('topicDescription');
        this.accompanimentForm.removeControl('solutionDescription');
        this.accompanimentForm.removeControl('important');
      }
    }),
    shareReplay(1),
    startWith(true),
  );

  @Output() public submitAccompaniment: EventEmitter<AccompanimentFormValue> = new EventEmitter();

  ngOnInit(): void { }

  save(): void {
    this.validated = true;

    if (!this.valid)
      return null;

    const { value } = this.accompanimentForm;

    let problemCount = 0;
    if (!!value.problems.academic)
      problemCount++;
    if (!!value.problems.administrative)
      problemCount++;
    if (!!value.problems.economic)
      problemCount++;
    if (!!value.problems.otherDescription)
      problemCount++;
    if (!!value.problems.psychosocial)
      problemCount++;
    if (!!value.problems.none) {
      problemCount = 0;
      value.problems.academic = false;
      value.problems.administrative = false;
      value.problems.economic = false;
      value.problems.psychosocial = false;
      value.important = false;
      value.problems.otherDescription = '';
    }

    const accompaniment = ({
      assets: this.files,
      followingKind: value.followingKind,
      problems: {
        none: value.problems.none,
        academic: value.problems.academic,
        administrative: value.problems.administrative,
        economic: value.problems.economic,
        otherDescription: !!value.problems.otherDescription
          ? (value.problems.otherDescription as string).trim()
          : null,
        psychosocial: value.problems.psychosocial,
        other: !!value.problems.otherDescription,
        problemCount
      },
      important: value.important ?? false,
      problemDescription: (value.problemDescription ?? 'Sin problemas' as string).trim(),
      semesterKind: value.semesterKind,
      solutionDescription: (value.solutionDescription ?? 'Sin problemas' as string).trim(),
      topicDescription: (value.topicDescription ?? 'Sin problemas' as string).trim(),
      studentId: value.studentId
    });
    this.submitAccompaniment.emit(accompaniment);
  }

  onFileChange(event) {
    const files: FileList = event.target.files;
    this.files = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
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
