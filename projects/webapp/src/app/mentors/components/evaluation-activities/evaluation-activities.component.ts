import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';

@Component({
  selector: 'sgm-evaluation-activities',
  templateUrl: './evaluation-activities.component.html',
  styleUrls: ['./evaluation-activities.component.scss']
})
export class EvaluationActivitiesComponent implements OnInit, OnDestroy {

  public activitiesForm: FormGroup;

  private dataSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly mentorService: MentorsService,
    private readonly logger: BrowserLoggerService,
  ) { }

  ngOnInit() {
    const evaluationObs = this.route.params.pipe(
      switchMap(params => this.mentorService.evaluationActivities(params.mentorId))
    );

    this.dataSubscription = evaluationObs.subscribe(
      evaluation => {
        this.activitiesForm = this.fb.group({
          meetings: evaluation?.meetings,
          sports: evaluation?.sports,
          academicEvent: evaluation?.academicEvent,
          socialEvent: evaluation?.socialEvent,
          virtualAccompaniment: evaluation?.virtualAccompaniment,
          other: evaluation?.other,
        });
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  /**
   * Save the current value of the evaluation form
   */
  async save() {
    // take a snapshot of the values required to save
    const { invalid, value: evaluation } = this.activitiesForm;
    const { mentorId } = this.route.snapshot.params;

    // validate the form doesn't have errors
    if (invalid)
      return;

    // save the evaluation
    try {
      await this.mentorService.saveEvaluationActivities(mentorId, evaluation);
      alert('se guardaron los cambios correctamente.');
    } catch (error) {
      this.logger.error('cant save evaluation form', error);
    }
  }
}
