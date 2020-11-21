import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';
import { AreasIds, Mentor, Mentors } from '../../../models/models';
import { ExportMentorsCSVService } from '../../services/export-mentors-csv.service';

interface AreaStat {
  id: AreasIds;
  name: string;
  studentsCount: number;
  accompanimentsCount: number;
  mentors: Array<Mentor>;
}

@Component({
  selector: 'sgm-list-mentors',
  templateUrl: './list-mentors.component.html'
})
export class ListMentorsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    public readonly auth: UserService,
    private readonly csvMentors: ExportMentorsCSVService,
  ) { }

  private exportSub: Subscription | null = null;

  public allMentors: Observable<Mentors> = this.route.params.pipe(
    mergeMap(params => this.mentorsService.getAllMentorsAndShare(params.periodId))
  );

  public areaStats: Observable<Array<AreaStat>> = this.allMentors
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

  ngOnInit() {
    this.title.setTitle('Estudiantes Mentores');
  }

  ngOnDestroy() {
    this.exportSub?.unsubscribe();
  }

  async exportCSV() {
    const exportTask = this.allMentors.pipe(
      take(1),
      switchMap(mentors => this.csvMentors.export(mentors)),
    );

    this.exportSub = exportTask.subscribe(async saved => {
      if (!saved)
        alert('Ocurrió un error al exportar los mentores');

      this.exportSub.unsubscribe();
      this.exportSub = null;
    });
  }

  get disabledButton() {
    return !!this.exportSub;
  }

}
