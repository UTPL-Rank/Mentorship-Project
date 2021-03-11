import { Component, Input } from '@angular/core';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GroupAccompanimentsProblems } from "./group-accompaniments-problems";

type AccompanimentEntry =
  | SGMAnalytics.LegacyAccompanimentEntry
  | SGMAnalytics.ProblemAccompanimentEntry
  | SGMAnalytics.NoProblemAccompanimentEntry;

@Component({
  selector: 'sgm-accompaniments-problems',
  templateUrl: './accompaniments-problems.component.html',
  styles: [
  ]
})
export class AccompanimentsProblemsComponent {

  private readonly accompanimentsSource: Subject<Array<AccompanimentEntry>> = new BehaviorSubject([] as Array<AccompanimentEntry>);
  private readonly filterSource = new BehaviorSubject(null) as Subject<string | null>;

  @Input('accompaniments')
  set setAccompaniments(accompaniments: Array<AccompanimentEntry> | null) {

    if (accompaniments)
      this.accompanimentsSource.next(accompaniments);
  }


  public readonly filterOptions$ = this.accompanimentsSource.asObservable().pipe(
    map(acc => acc.map(a => a.degree)),
  )

  private readonly accompaniments$ = combineLatest([this.accompanimentsSource.asObservable(), this.filterSource]).pipe(
    map(([accompaniments, filter]) => filter ? accompaniments.filter(a => a.degree.id === filter) : accompaniments),
  );

  private readonly problems$ = this.accompaniments$.pipe(
    map(acc => GroupAccompanimentsProblems(acc)),
    shareReplay(1),
    map(a => [...a])
  );

  public readonly pieData$ = this.problems$.pipe(
    map(res => res.map(a => a[1]))
  );

  public readonly allProblemsCount$ = this.pieData$.pipe(
    map(data => data.reduce((con, d) => con + d, 0)),
    shareReplay(1),
  )

  public readonly pieLabels$ = this.problems$.pipe(
    map(res => res.map(a => a[0]))
  );

  public readonly tags$ = combineLatest([this.problems$, this.allProblemsCount$]).pipe(
    map(([problems, allCount]) => problems.map(([problem, count]) => {
      const percentage = (count / allCount * 100).toFixed(2);
      const newRes = { problem, count, percentage }
      return newRes;
    })),
  );

  /**
   * Filter mentors by degree
   * @param selection name of the degree selected
   */
  public applyFilter(selection: string | null) {
    this.filterSource.next(selection);
  }


}
