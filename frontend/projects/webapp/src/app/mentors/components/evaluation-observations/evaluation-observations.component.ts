import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MentorEvaluationObservation } from '../../../models/models';

@Component({
  selector: 'sgm-evaluation-observations',
  templateUrl: './evaluation-observations.component.html',
  styleUrls: ['./evaluation-observations.component.scss']
})
export class EvaluationObservationsComponent implements OnInit {

  @Output()
  observations = new EventEmitter<MentorEvaluationObservation>();

  constructor(private readonly fb: FormBuilder) { }

  public observationsForm: FormGroup;

  ngOnInit() {
    this.observationsForm = this.fb.group({
      positives: null,
      inconveniences: null,
      suggestions: null,
    });
  }

  save() {
    const { invalid, value } = this.observationsForm;

    if (invalid)
      return;

    this.observations.emit(value);

  }
}
