import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AreasIds, Mentor, Mentors } from '../../../models/models';

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
export class ListMentorsPageComponent implements OnInit {
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  public allMentors: Observable<Mentors>;
  public bestMentors: Observable<Mentors>;
  public areaStats: Observable<Array<AreaStat>>;

  private mentorsCollection = this.route.params
    .pipe(
      this.perf.trace('list mentors'),
      map(params => this.db.collection('academic-periods').doc(params.periodId).ref),
      map(periodRef => this.db.collection<Mentor>('mentors', r => r
        .where('period.reference', '==', periodRef)
        .orderBy('displayName')
      )),
      switchMap(collection => collection.valueChanges()),
      shareReplay(1),
      map(mentors => [...mentors])
    );

  ngOnInit() {
    this.title.setTitle('Estudiantes Mentores');

    this.getAllMentors();
    this.getBestMentors();
    this.groupMentorsByArea();
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
}
