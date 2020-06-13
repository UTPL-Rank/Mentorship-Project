import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

export interface ReviewFormValue {
  qualification: string;
  comment?: string;
  digitalSignature: string;
}

@Component({
  selector: "sgm-review-form-card",
  templateUrl: "./review-form-card.component.html"
})
export class ReviewFormCardComponent implements OnInit {
  constructor(private fb: FormBuilder) { }

  @ViewChild(SigCanvasComponent)
  private sigCanvas: SigCanvasComponent;

  public confirmationForm: FormGroup;
  private validated = false;

  @Output() public submitReview: EventEmitter<
    ReviewFormValue
  > = new EventEmitter();

  ngOnInit(): void {
    this.confirmationForm = this.fb.group({
      qualification: [null, Validators.required],
      comment: [null]
    });
  }

  save() {
    this.validated = true;

    if (this.confirmationForm.invalid) {
      return;
    }

    const { qualification, comment } = this.confirmationForm.value;

    if (this.sigCanvas.isCanvasBlank()) {
      alert("Tiene que ingresar la firma digital.");
      return;
    }

    this.submitReview.emit({
      qualification,
      digitalSignature: this.sigCanvas.getDataURL(),
      comment: !!comment ? (comment as string).trim() : null
    });
  }

  resetSignature() {
    this.sigCanvas.clearCanvas();
  }

  get isQualificationInvalid() {
    const { invalid, touched } = this.confirmationForm.controls.qualification;
    return invalid && (touched || this.validated);
  }
}
