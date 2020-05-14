import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../../core/services/academic-period.service';
import { TitleService } from '../../../core/services/title.service';
import { AreasIds, Mentor, Mentors } from '../../../models/models';
import { MentorsService } from '../../services/mentors.service';

interface AreaStat {
  id: AreasIds;
  name: string;
  studentsCount: number;
  accompanimentsCount: number;
  mentors: Array<Mentor>;
}

@Component({
  selector: 'sgm-list-mentors-page',
  templateUrl: './list-mentors-page.component.html'
})
export class ListMentorsPageComponent implements OnInit, OnDestroy {
  constructor(
    private title: TitleService,
    private route: ActivatedRoute,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService,
    private readonly router: Router
  ) { }

  public allMentors: Observable<Mentors>;
  public bestMentors: Observable<Mentors>;
  public areaStats: Observable<Array<AreaStat>>;

  public mentors: Mentors;
  private sub: Subscription;

  private mentorsCollection = this.route.params
    .pipe(
      map(params => this.periodsService.periodDocumentReference(params.periodId)),
      mergeMap(periodReference => this.mentorsService.mentorsCollection({
        periodReference, startAt: 4, orderBy: 'displayName',
      })),
      tap(mentors => {
        console.table(mentors.map(m => m.displayName));
        this.mentors = mentors;
      }),
      shareReplay(1),
      map(mentors => [...mentors]),
      finalize(() => console.log('endeed')
      )
    );

  ngOnInit() {
    this.title.setTitle('Estudiantes Mentores');

    // this.getAllMentors();
    // this.getBestMentors();
    // this.groupMentorsByArea();

    this.sub = this.mentorsCollection.subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getAllMentors() {
    this.allMentors = this.mentorsCollection;
  }

  private getBestMentors() {
    this.bestMentors = this.mentorsCollection
      .pipe(
        map(mentors => mentors.sort((m1, m2) => m2.stats.accompanimentsCount - m1.stats.accompanimentsCount)),
        map(mentors => mentors.slice(0, 5)),
      );
  }

  private groupMentorsByArea() {
    this.areaStats = this.mentorsCollection
      .pipe(
        map(mentors => {
          const mentorPerArea: Map<AreasIds, AreaStat> = new Map();

          // for each mentor, store it in corresponding area entry
          mentors.forEach(mentor => {
            const areaId = mentor.area.reference.id as AreasIds;


            // Increment the data already stored
            if (mentorPerArea.has(areaId)) {
              // get entry
              const entry = mentorPerArea.get(areaId);

              // update the data of the entry
              entry.studentsCount += mentor.stats.assignedStudentCount;
              entry.accompanimentsCount += mentor.stats.accompanimentsCount;
              entry.mentors.push(mentor);

              // store data with updated values
              mentorPerArea.set(areaId, entry);
            } else {
              // create a new entry with the area and first mentor
              const newEntry: AreaStat = {
                id: areaId,
                name: mentor.area.name,
                studentsCount: mentor.stats.assignedStudentCount,
                accompanimentsCount: mentor.stats.accompanimentsCount,
                mentors: [mentor]
              };

              // store new entry in the map
              mentorPerArea.set(areaId, newEntry);
            }
          });

          return mentorPerArea;
        }),
        map(areasMap => Array.from(areasMap.values()))
      );
  }

  prevPage() {
  }

  async nextPage() {
    await this.router.navigate([this.router.url], { queryParams: { data: Date.now() } });
    this.sub.unsubscribe();
    this.sub.unsubscribe();
    this.sub = this.route.params
      .pipe(
        map(params => this.periodsService.periodDocumentReference(params.periodId)),
        mergeMap(periodReference => this.mentorsService.mentorsCollection({
          periodReference, startAt: 4, orderBy: 'displayName', last: this.mentors.pop()
        })),
        tap(mentors => {
          console.table(mentors.map(m => m.displayName));
          this.mentors = mentors;
        }),
        shareReplay(1),
        map(mentors => [...mentors]),
        finalize(() => console.log('endeed2'))
      ).subscribe();

  }
}
