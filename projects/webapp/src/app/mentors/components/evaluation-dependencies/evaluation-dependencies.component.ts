import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MentorEvaluationDependencies } from '../../../models/models';

@Component({
  selector: 'sgm-evaluation-dependencies',
  templateUrl: './evaluation-dependencies.component.html',
  styleUrls: ['./evaluation-dependencies.component.scss']

})

export class EvaluationDependenciesComponent implements OnInit {
  constructor(private readonly fb: FormBuilder) { }

  public dependenciesForm: FormGroup;

  @Output()
  dependencies = new EventEmitter<MentorEvaluationDependencies>();

  ngOnInit() {
    this.dependenciesForm = this.fb.group({
      coordinator: null,
      teachers: null,
      missions: null,
      chancellor: null,
      library: null,
      firstSolvedByMentor: null,
      otherServices: null,
      other: null,
    });
  }

  save() {
    const { invalid, value } = this.dependenciesForm;

    if (invalid)
      return;

    this.dependencies.emit(value);
  }
}
