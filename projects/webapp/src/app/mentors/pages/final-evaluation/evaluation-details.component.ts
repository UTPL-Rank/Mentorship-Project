import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';

@Component({
  selector: 'sgm-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationDetailsComponent implements OnInit, OnDestroy {

  public detailsForm!: FormGroup;
  public saved = false;
  public mentor!: SGMMentor.readDTO;

  private mentorSubscription!: Subscription;
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
      switchMap(params => this.mentorService.evaluationDetails(params.mentorId))
    );

    const mentorObs = this.route.params.pipe(
      switchMap(params => this.mentorService.mentor(params.mentorId))
    );

    this.mentorSubscription = mentorObs.subscribe(m => this.mentor = m);

    this.dataSubscription = evaluationObs.subscribe(
      evaluation => {
        this.detailsForm = this.fb.group({
          mentorFirstTime: evaluation?.mentorFirstTime,
          principalProblems: evaluation?.principalProblems,
          studentsWithoutAccompaniments: evaluation?.studentsWithoutAccompaniments,
        });

        // save value on demand
        const formChanges = this.detailsForm.valueChanges.pipe(debounceTime(1000));
        this.valueSubscription = formChanges.subscribe(() => {
          this.save();
        });
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.valueSubscription.unsubscribe();
    this.mentorSubscription.unsubscribe();
  }

  /**
   * Save the current value of the evaluation form
   */
  async save() {
    // take a snapshot of the values required to save
    const { invalid, value: evaluation } = this.detailsForm;
    const { mentorId } = this.route.snapshot.params;

    // validate the form doesn't have errors
    if (invalid)
      return;

    // save the evaluation
    try {
      await this.mentorService.saveEvaluationDetails(mentorId, evaluation);
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

  get studentsWithAccompaniments() {
    return this.mentor.students.withAccompaniments.join(', ');
  }

  get studentsWithoutAccompaniments() {
    return this.mentor.students.withoutAccompaniments.join(', ');
  }

  get studentsDegrees() {
    return this.mentor.students.degrees.join(', ');
  }
}
