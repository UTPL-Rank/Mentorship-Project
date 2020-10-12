import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';
import { AreasIds, Mentor, Mentors } from '../../../models/models';

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
export class ListMentorsComponent implements OnInit {
  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    public readonly auth: UserService,
  ) { }

  public allMentors: Observable<Mentors> = this.route.params.pipe(
    mergeMap(params => this.mentorsService.getAllMentorsAndShare(params.periodId))
  );

  public bestMentors: Observable<Mentors> = this.allMentors
    .pipe(
      map(mentors => mentors.sort((m1, m2) => m2.stats.accompanimentsCount - m1.stats.accompanimentsCount)),
      map(mentors => mentors.slice(0, 5)),
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

  exportCSV() {
    const source = this.mentorsService.generateCSV();

    source.subscribe(content => {
      console.log(content);

      const downloadElement = document.createElement('a') as HTMLAnchorElement;
      downloadElement.style.display = 'none';
      downloadElement.setAttribute('href', 'data:text/csv;charset=utf-8' + content);
      downloadElement.setAttribute('download', 'mentores.csv');
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.removeChild(downloadElement);
    });
  }

}
