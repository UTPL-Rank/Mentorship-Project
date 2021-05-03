import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';

@Component({
  selector: 'sgm-evaluation-activities',
  templateUrl: './evaluation-activities.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationActivitiesComponent implements OnInit, OnDestroy {

  public activitiesForm!: FormGroup;
  public saved = false;

  private dataSubscription!: Subscription;
  private valueSubscription!: Subscription;

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

        // save value on demand
        const formChanges = this.activitiesForm.valueChanges.pipe(debounceTime(1000));
        this.valueSubscription = formChanges.subscribe(() => {
          this.save();
        });
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.valueSubscription.unsubscribe();
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
      this.showSave();
    } catch (error) {
      this.logger.error('cant save evaluation form', error);
    }
  }

  /** show save message for a few seconds */
  private showSave() {
    this.saved = true;
    setTimeout(() => this.saved = false, 1000);
  }
}
