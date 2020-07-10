import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';

@Component({
  selector: 'sgm-evaluation-dependencies',
  templateUrl: './evaluation-dependencies.component.html',
  styleUrls: ['./evaluation-dependencies.component.scss']
})
export class EvaluationDependenciesComponent implements OnInit, OnDestroy {
  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly mentorService: MentorsService,
    private readonly logger: BrowserLoggerService,
  ) { }

  public dependenciesForm: FormGroup;

  private dataSubscription: Subscription;

  ngOnInit() {
    const evaluationObs = this.route.params.pipe(
      switchMap(params => this.mentorService.evaluationDependencies(params.mentorId))
    );
    this.dataSubscription = evaluationObs.subscribe(
      evaluation => {
        this.dependenciesForm = this.fb.group({
          coordinator: evaluation?.coordinator,
          teachers: evaluation?.teachers,
          missions: evaluation?.missions,
          chancellor: evaluation?.chancellor,
          library: evaluation?.library,
          firstSolvedByMentor: evaluation?.firstSolvedByMentor,
          otherServices: evaluation?.otherServices,
          other: evaluation?.other,
        });
      });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  /**
   * Save the current value of the evaluation form
   */
  async save() {
    // take a snapshot of the values required to save
    const { invalid, value: evaluation } = this.dependenciesForm;
    const { mentorId } = this.route.snapshot.params;

    // validate the form doesn't have errors
    if (invalid)
      return;

    // save the evaluation
    try {
      await this.mentorService.saveEvaluationDependencies(mentorId, evaluation);
      alert('se guardaron los cambios correctamente.');
    } catch (error) {
      this.logger.error('cant save evaluation form', error);
    }
  }
}
