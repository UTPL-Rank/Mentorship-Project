import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewFormValue } from '../../../models/review-form.model';
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

@Component({
  selector: 'sgm-review-form-card',
  templateUrl: './review-form-card.component.html'
})
export class ReviewFormCardComponent implements OnInit {

  @ViewChild(SigCanvasComponent)
  public sigCanvas: SigCanvasComponent;

  public confirmationForm: FormGroup;
  private validated = false;

  @Output()
  public submitReview = new EventEmitter<ReviewFormValue>();

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.confirmationForm = this.fb.group({
      qualification: [null, Validators.required],
      comment: [null]
    });
  }

  save() {
    // take snapshot of the current form
    const { invalid, value } = this.confirmationForm;
    const { qualification, comment } = value;

    this.validated = true;

    // invalid forms will be rejected
    if (invalid) return;

    // all submissions needs the user signature
    if (this.sigCanvas.isCanvasBlank()) {
      alert('Tiene que ingresar la firma digital.');
      return;
    }

    this.submitReview.emit({
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