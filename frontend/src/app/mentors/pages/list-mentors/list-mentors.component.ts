import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicArea, SGMMentor } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';
import { ExportMentorsCSVService } from '../../services/export-mentors-csv.service';

interface AreaStat {
  id: SGMAcademicArea.AreaType;
  name: string;
  studentsCount: number;
  accompanimentsCount: number;
  mentors: Array<SGMMentor.readDTO>;
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

  public allMentors: Observable<Array<SGMMentor.readDTO>> = this.route.params.pipe(
    mergeMap(params => this.mentorsService.getAllMentorsAndShare(params.periodId))
  );

  public areaStats: Observable<Array<AreaStat>> = this.allMentors
    .pipe(
      map(mentors => {
        const mentorPerArea: Map<SGMAcademicArea.AreaType, AreaStat> = new Map();

        // for each mentor, store it in corresponding area entry
        mentors.forEach(mentor => {
          const areaId = mentor.area.reference.id as SGMAcademicArea.AreaType;


          // Increment the data already stored
          if (mentorPerArea.has(areaId)) {
            // get entry
            const entry = mentorPerArea.get(areaId) as AreaStat;

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

    if (!!this.exportSub)
      return;

    const exportTask = this.route.params.pipe(
      take(1),
      switchMap(params => this.csvMentors.export$({ periodId: params.periodId }))
    );

    this.exportSub = exportTask.subscribe(async saved => {
      if (!saved)
        alert('Ocurrió un error al exportar los mentores');

      this.exportSub?.unsubscribe();
      this.exportSub = null;
    });
  }

  get disabledButton() {
    return !!this.exportSub;
  }

}
