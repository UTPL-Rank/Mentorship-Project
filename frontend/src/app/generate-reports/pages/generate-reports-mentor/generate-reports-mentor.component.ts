import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicArea, SGMMentor } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';


interface AreaStat {
  id: SGMAcademicArea.AreaType;
  name: string;
  studentsCount: number;
  accompanimentsCount: number;
  mentors: Array<SGMMentor.readDTO>;
}
@Component({
  selector: 'sgm-generate-reports-mentor',
  templateUrl: './generate-reports-mentor.component.html',
  styles: [
  ]
})
export class GenerateReportsMentorComponent implements OnInit {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    public readonly auth: UserService,
  ) { }

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

}
