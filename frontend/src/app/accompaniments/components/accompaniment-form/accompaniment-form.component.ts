import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SGMAccompaniment, SGMStudent } from '@utpl-rank/sgm-helpers';
import { Subscription } from 'rxjs';
import { IAccompanimentForm } from '../../models/i-accompaniment-form';
import { SaveAccompanimentService } from '../services/save-accompaniment.service';
import { SGMProblem, SGMSubProblem } from '../../../models/problem.model';
import { ProblemService } from '../../../core/services/problem.service';

@Component({
  selector: 'sgm-accompaniment-form',
  templateUrl: './accompaniment-form.component.v2.html'
})
export class AccompanimentFormComponent implements OnDestroy {

  public problems!: SGMProblem [];
  public problem!: SGMProblem;
  public subproblem!: SGMSubProblem;

  constructor(
    private readonly fb: FormBuilder,
    private readonly saveAccompaniment: SaveAccompanimentService,
    private readonly router: Router,
    private readonly problemService: ProblemService,
  ) {
    this.problemService.getProblemsCollection().valueChanges().subscribe(
      problems => {
        this.problems = problems;
        this.problem = this.problems[0];
      }
    );
  }

  @Input()
  students!: Array<SGMStudent.readDTO>;

  @Input()
  mentorId!: string;

  public readonly followingKindOptions = SGMAccompaniment.FollowingKindOptions;
  public readonly semesterKindOptions = SGMAccompaniment.SemesterKindOptions;
  private selectedStudentId: string | null = null;
  private savingSubscription: Subscription | null = null;

  // before setting `selectedStudentId`, validate it exist within the students
  @Input('selectedStudentId')
  set setSelectedStudentId(selectedStudentId: string | null) {
    if (!selectedStudentId)
      return;

    const valid = this.students.map(s => s.id).includes(selectedStudentId);

    if (valid)
      this.selectedStudentId = selectedStudentId;
  }

  public academicShow = true;
  public administrativeShow = true;
  public economicShow = true;
  public psychosocialShow = true;
  public connectivityShow = true;
  public otherShow = true;
  public noneShow = true;

  private academicAccompaniment: FormControl = this.fb.control(false);
  private administrativeAccompaniment: FormControl = this.fb.control(false);
  private economicAccompaniment: FormControl = this.fb.control(false);
  private psychosocialAccompaniment: FormControl = this.fb.control(false);
  private connectivityAccompaniment: FormControl = this.fb.control(false);
  private otherAccompaniment: FormControl = this.fb.control(false);
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
      academic: this.academicAccompaniment,
      administrative: this.administrativeAccompaniment,
      economic: this.economicAccompaniment,
      psychosocial: this.psychosocialAccompaniment,
      connectivity: this.connectivityAccompaniment,
      other: this.otherAccompaniment,
    })

  });

  private validated = false;
  private files: File[] = [];

  // Show - hide checkboxs logic

  showSubproblem(problem: string){
    this.accompanimentForm.removeControl('problemDescription');
    // @ts-ignore
    this.problem = this.problems.find(p => p.id === problem);
    this.accompanimentForm.addControl('subproblem', this.fb.control(null, Validators.required));
  }

  hideSubproblem(){
    this.accompanimentForm.removeControl('subproblem');
    this.accompanimentForm.removeControl('problematic');
    this.accompanimentForm.addControl('problemDescription', this.fb.control(null, Validators.required));
  }

  showProblematic(problem: string){
    this.accompanimentForm.removeControl('problemDescription');
    // @ts-ignore
    this.problem = this.problems.find(p => p.id === problem);
    // @ts-ignore
    this.subproblem = this.problem.subproblems[0];
    this.accompanimentForm.addControl('problematic', this.fb.control(null, Validators.required));
  }

  hideProblematic(){
    this.accompanimentForm.removeControl('problematic');
    this.accompanimentForm.addControl('problemDescription', this.fb.control(null, Validators.required));
  }

  changeSubproblem(subproblem: string): void {
    // @ts-ignore
    this.subproblem = this.problem.subproblems.find(s => s.name === subproblem);
    this.accompanimentForm.addControl('problematic', this.fb.control(null, Validators.required));
  }

  showProblems(){
    this.noneShow = true;
    this.academicShow = true;
    this.administrativeShow = true;
    this.economicShow = true;
    this.psychosocialShow = true;
    this.connectivityShow = true;
    this.otherShow = true;
  }

  hideProblems(){
    this.noneShow = false;
    this.academicShow = false;
    this.administrativeShow = false;
    this.economicShow = false;
    this.psychosocialShow = false;
    this.connectivityShow = false;
    this.otherShow = false;
  }

  changeAcademic(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
      this.showSubproblem('academic');
    } else {
      this.showProblems();
      this.hideSubproblem();
    }
    this.academicShow = true;
  }

  changeAdministrative(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
      this.showSubproblem('administrative');
    } else {
      this.showProblems();
      this.hideSubproblem();
    }
    this.administrativeShow = true;
  }

  changeEconomic(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
      this.showProblematic('economic');
    } else {
      this.showProblems();
      this.hideProblematic();
    }
    this.economicShow = true;
  }

  changePsychosocial(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
      this.showProblematic('psychosocial');
    } else {
      this.showProblems();
      this.hideProblematic();
    }
    this.psychosocialShow = true;
  }

  changeConnectivity(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
    } else {
      this.showProblems();
    }
    this.connectivityShow = true;
  }

  changeOther(hasBeenChecked: boolean){
    if (!hasBeenChecked) {
      this.showProblems();
    } else {
      this.hideProblems();
    }
    this.otherShow = true;
  }

  changeNone(hasBeenChecked: boolean){
    if (hasBeenChecked) {
      this.hideProblems();
      this.accompanimentForm.removeControl('problemDescription');
      this.accompanimentForm.removeControl('solutionDescription');
      this.accompanimentForm.addControl('topicDescription', this.fb.control(null, Validators.required));
      this.accompanimentForm.addControl('topic', this.fb.control(null, Validators.required));
    } else {
      this.showProblems();
      this.accompanimentForm.addControl('problemDescription', this.fb.control(null, Validators.required));
      this.accompanimentForm.addControl('solutionDescription', this.fb.control(null, Validators.required));
      this.accompanimentForm.removeControl('topicDescription');
      this.accompanimentForm.removeControl('topic');
    }
    this.noneShow = true;
  }

  ngOnDestroy(): void {
    this.savingSubscription?.unsubscribe();
  }

  save(): void {
    this.validated = true;

    if (!!this.savingSubscription)
      return;

    if (!this.valid) {
      alert('El formulario es inválido');
      return;
    }

    const formValue: IAccompanimentForm = this.accompanimentForm.value;

    this.savingSubscription = this.saveAccompaniment.save(this.mentorId, formValue, this.files).subscribe(
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

        this.savingSubscription?.unsubscribe();
        this.savingSubscription = null;
      }
    );
  }

  test(): void {
    this.validated = true;

    if (!!this.savingSubscription)
      return;

    if (!this.valid) {
      alert('El formulario es invalido');
      return;
    }

    const formValue: IAccompanimentForm = this.accompanimentForm.value;

    console.log(formValue);
  }

  onFileChange(event: HTMLElementEventMap['change']) {
    const files: FileList | null = (event?.target as HTMLInputElement)?.files;
    this.files = [];
    if (files)
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < files.length; i++)
        this.files.push(files[i]);
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
  get isTopicInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.topic;
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

  get isProblematicInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.problematic;
    return invalid && (touched || this.validated);
  }

  get isSubproblemInvalid() {
    const { invalid, touched } = this.accompanimentForm.controls.subproblem;
    return invalid && (touched || this.validated);
  }

  get isProblemsValid() {
    const {
      academic,
      administrative,
      economic,
      psychosocial,
      otherDescription,
      connectivity,
      other,
      none
    } = this.accompanimentForm.controls.problems.value;

    return (
      !!academic ||
      !!administrative ||
      !!economic ||
      !!psychosocial ||
      !!connectivity ||
      !!other ||
      !!none ||
      !!otherDescription
    );
  }
}
