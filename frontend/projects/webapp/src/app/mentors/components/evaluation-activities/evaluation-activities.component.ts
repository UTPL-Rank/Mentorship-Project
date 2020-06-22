import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MentorEvaluationActivities } from '../../../models/models';

@Component({
  selector: 'sgm-evaluation-activities',
  templateUrl: './evaluation-activities.component.html',
  styleUrls: ['./evaluation-activities.component.scss']
})

export class EvaluationActivitiesComponent implements OnInit {

  constructor(private readonly fb: FormBuilder) { }

  public activitiesForm: FormGroup;

  @Output()
  activities = new EventEmitter<MentorEvaluationActivities>();

  ngOnInit() {
    this.activitiesForm = this.fb.group({
      meetings: null,
      sports: null,
      academicEvent: null,
      socialEvent: null,
      virtualAccompaniment: null,
      other: null,
    });
  }


  save() {
    const { invalid, value } = this.activitiesForm;

    if (invalid)
      return;

    this.activities.emit(value);
  }
}
