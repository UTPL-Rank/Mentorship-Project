import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Students } from "../../../models/models";

export interface AccompanimentFormValue {
  studentId: string;

  semesterKind: string;
  followingKind: string;
  problemDescription: string;
  solutionDescription: string;
  topicDescription: string;

  problems: {
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
  selector: "sgm-accompaniment-form",
  templateUrl: "./accompaniment-form.component.html"
})
export class AccompanimentFormComponent implements OnInit {
  constructor(private fb: FormBuilder) { }

  @Input()
  students: Students;

  @Input()
  mentorId: string;

  private selectedStudentId: string = null;

  // before setting `selectedStudentId`, validate it exist within the students
  @Input("selectedStudentId")
  set setSelectedStudentId(selectedStudentId: string) {
    const valid = this.students.map(s => s.id).includes(selectedStudentId);
    if (valid) {
      this.selectedStudentId = selectedStudentId;
    }
  }

  public accompanimentForm: FormGroup;
  private validated = false;
  private files: File[] = [];

  @Output() public submitAccompaniment: EventEmitter<
    AccompanimentFormValue
  > = new EventEmitter();

  ngOnInit(): void {
    this.accompanimentForm = this.fb.group({
      studentId: [this.selectedStudentId, Validators.required],

      semesterKind: [null, Validators.required],
      followingKind: [null, Validators.required],
      problemDescription: [null, Validators.required],
      solutionDescription: [null, Validators.required],
      topicDescription: [null, Validators.required],

      problems: this.fb.group({
        academic: [false],
        administrative: [false],
        economic: [false],
        psychosocial: [false],
        otherDescription: [null]
      })
    });
  }

  save(): void {
    this.validated = true;

    if (!this.valid) {
      return null;
    }

    const { value } = this.accompanimentForm;

    let problemCount = 0;
    if (!!value.problems.academic) {
      problemCount++;
    }
    if (!!value.problems.administrative) {
      problemCount++;
    }
    if (!!value.problems.economic) {
      problemCount++;
    }
    if (!!value.problems.otherDescription) {
      problemCount++;
    }
    if (!!value.problems.psychosocial) {
      problemCount++;
    }

    this.submitAccompaniment.emit({
      assets: this.files,
      followingKind: value.followingKind,
      problems: {
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
      problemDescription: (value.problemDescription as string).trim(),
      semesterKind: value.semesterKind,
      solutionDescription: (value.solutionDescription as string).trim(),
      topicDescription: (value.topicDescription as string).trim(),
      studentId: value.studentId
    });
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
      otherDescription
    } = this.accompanimentForm.controls.problems.value;

    return (
      !!academic ||
      !!administrative ||
      !!economic ||
      !!psychosocial ||
      !!otherDescription
    );
  }
}
