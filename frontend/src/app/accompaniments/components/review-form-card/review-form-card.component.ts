import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { ReviewFormValue } from '../../../models/review-form.model';
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

@Component({
  selector: 'sgm-review-form-card',
  templateUrl: './review-form-card.component.html'
})
export class ReviewFormCardComponent implements OnInit {
  viewform = 'true';

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  @ViewChild(SigCanvasComponent)
  public sigCanvas!: SigCanvasComponent;

  public confirmationForm: FormGroup = this.fb.group({
    isGiven: [null, Validators.required],
    qualification: [null],
    comment: [null]
  });
  private validated = false;

  @Output()
  public submitReview = new EventEmitter<ReviewFormValue>();

  public readonly qualificationOptions = SGMAccompaniment.QualificationKindOptions;

  ngOnInit(): void {
    this.onChanges();
  }

  onChanges(): void {
    this.confirmationForm.valueChanges.subscribe(
      value => this.viewform = value.isGiven);
  }

  save() {
    // take snapshot of the current form
    const { invalid, value } = this.confirmationForm;
    const { isGiven, qualification, comment } = value;

    this.validated = true;

    // invalid forms will be rejected
    if (invalid) return;

    // all submissions needs the user signature
    if (this.sigCanvas.isCanvasBlank()) {
      alert('Tiene que ingresar la firma digital.');
      return;
    }

    this.submitReview.emit({
      isGiven,
      qualification,
      digitalSignature: this.sigCanvas.getDataURL(),
      comment: !!comment ? (comment as string).trim() : null
    });
  }

  get isQualificationInvalid() {
    const { invalid, touched } = this.confirmationForm.controls.qualification;
    return invalid && (touched || this.validated);
  }

}
