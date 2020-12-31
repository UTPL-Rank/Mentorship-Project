import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';

@Component({
  selector: 'sgm-evaluation-dependencies',
  templateUrl: './evaluation-dependencies.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationDependenciesComponent implements OnInit, OnDestroy {

  public dependenciesForm!: FormGroup;
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
        // save value on demand
        const formChanges = this.dependenciesForm.valueChanges.pipe(debounceTime(1000));
        this.valueSubscription = formChanges.subscribe(() => {
          this.save();
        });
      });
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
    const { invalid, value: evaluation } = this.dependenciesForm;
    const { mentorId } = this.route.snapshot.params;

    // validate the form doesn't have errors
    if (invalid)
      return;

    // save the evaluation
    try {
      await this.mentorService.saveEvaluationDependencies(mentorId, evaluation);
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
