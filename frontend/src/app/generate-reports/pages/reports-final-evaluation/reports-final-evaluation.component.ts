import { Component, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MentorsService } from '../../../core/services/mentors.service';
import { UserService } from '../../../core/services/user.service';
import {SGMAcademicPeriod, SGMMentor} from '@utpl-rank/sgm-helpers';
import {UserSignature} from '../../../models/user';
import {
  MentorEvaluationActivities,
  MentorEvaluationDependencies,
  MentorEvaluationDetails, MentorEvaluationObservations
} from '../../../models/mentor.model';
import {take} from 'rxjs/operators';
import {AcademicPeriodsService} from "../../../core/services/academic-periods.service";

type FinalEvaluation = {
  mentor: SGMMentor.readDTO;
  details: MentorEvaluationDetails;
  activities: MentorEvaluationActivities;
  dependencies: MentorEvaluationDependencies;
  observations: MentorEvaluationObservations;
};

@Component({
  selector: 'sgm-reports-final-evaluation',
  templateUrl: './reports-final-evaluation.component.html',
  styleUrls: ['./reports-final-evaluation.component.scss']
})
export class ReportsFinalEvaluationComponent implements OnInit {

  public TITLE_COVER = 'EVALUACIÓN FINAL DE MENTORÍA';
  public TYPE_COVER: string | undefined;

  public mentorId!: string;
  public reportDate!: string;
  public signature!: string | undefined;
  private paramsSubscription!: Subscription;
  private userSubscription!: Subscription;
  // public finalEvaluation!: FinalEvaluation;

  public mentor!: SGMMentor.readDTO;
  public details!: MentorEvaluationDetails;
  public activities!: MentorEvaluationActivities;
  public dependencies!: MentorEvaluationDependencies;
  public observations!: MentorEvaluationObservations;
  public academicPeriod!: SGMAcademicPeriod.readDTO;
  public prevPeriod!: SGMAcademicPeriod.readDTO;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly academicPeriodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService
  ) { }

  ngOnInit(): void {

    this.reportDate = new Date().toLocaleDateString();

    this.paramsSubscription = this.route.params.subscribe(
      async (params: Params) => {
        const mentorId = params.mentorId;
        const periodId = params.periodId;
        const signatureMentorId = mentorId.split('-')[2];
        this.userService.signatureOf(signatureMentorId).subscribe(
          async result => this.signature = await result?.data as string
        );
        this.academicPeriod = await this.academicPeriodsService.one$(periodId).pipe(take(1)).toPromise().then();
        // @ts-ignore
        this.prevPeriod = await this.academicPeriodsService.one$(this.academicPeriod.prevPeriodId).pipe(take(1)).toPromise().then();
        this.mentor = await this.mentorsService.mentor(mentorId).pipe(take(1)).toPromise().then();
        this.details = await this.mentorsService.evaluationDetails(mentorId).pipe(take(1)).toPromise().then();
        this.activities = await this.mentorsService.evaluationActivities(mentorId).pipe(take(1)).toPromise().then();
        this.dependencies = await this.mentorsService.evaluationDependencies(mentorId).pipe(take(1)).toPromise().then();
        this.observations = await this.mentorsService.evaluationObservations(mentorId).pipe(take(1)).toPromise().then();
      }
    );

  }

}
