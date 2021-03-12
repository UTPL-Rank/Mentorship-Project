import { Component, Input } from '@angular/core';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'sgm-students-with-accompaniments',
  templateUrl: './students-with-accompaniments.component.html',
})
export class StudentsWithAccompanimentsComponent {

  private readonly studentsSource: Subject<Array<SGMAnalytics.StudentEntry>> = new BehaviorSubject([] as Array<SGMAnalytics.StudentEntry>);

  @Input('students')
  set setStudents(students: Array<SGMAnalytics.StudentEntry> | null) {

    if (students)
      this.studentsSource.next(students);
  }

  private readonly filterSource = new BehaviorSubject(null) as Subject<string | null>;

  public readonly filterOptions$ = this.studentsSource.asObservable().pipe(
    map(students => students
      .map(a => a.degree)
      .reduce((acc, a) => {
        if (!(a.id in acc))
          acc[a.id] = a

        return acc;
      }, {} as Record<string, { id: string, name: string }>)),
    map(res => Object.values(res))
  )

  public readonly students$ = combineLatest([this.studentsSource.asObservable(), this.filterSource]).pipe(
    map(([students, filter]) => filter ? students.filter(a => a.degree.id === filter) : students),
    shareReplay(1),
    map(s => [...s])
  );

  public readonly withAccompaniments$ = this.students$.pipe(
    map(sts => sts.filter(student => student.accompanimentsCount > 0)),
    shareReplay(1),
  );

  public readonly withoutAccompaniments$ = this.students$.pipe(
    map(sts => sts.filter(student => student.accompanimentsCount === 0)),
    shareReplay(1),
  );

  public readonly total$ = this.students$.pipe(
    map(sts => sts.length),
    shareReplay(1),
  );

  public readonly totalWithAccompaniments$ = this.withAccompaniments$.pipe(
    map(sts => sts.length),
    shareReplay(1),
  );

  public readonly totalWithoutAccompaniments$ = this.withoutAccompaniments$.pipe(
    map(sts => sts.length),
    shareReplay(1),
  );

  public readonly percentageWithAccompaniments$ = combineLatest([this.total$, this.totalWithAccompaniments$]).pipe(
    map(([total, sub]) => Math.trunc(sub / total * 100)),
    shareReplay(1),
  );

  public readonly percentageWithoutAccompaniments$ = combineLatest([this.total$, this.totalWithoutAccompaniments$]).pipe(
    map(([total, sub]) => Math.trunc(sub / total * 100)),
    shareReplay(1),
  );

  public applyFilter(selection: string | null) {
    this.filterSource.next(selection);
  }
}
