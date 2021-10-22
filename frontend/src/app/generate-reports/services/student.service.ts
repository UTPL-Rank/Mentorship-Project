
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MentorsService } from '../../core/services/mentors.service';
import { StudentsService } from '../../core/services/students.service';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private readonly route: ActivatedRoute
    /*
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService
    */
  ) { }


  public student_data = this.route.data.pipe(
    map(d => ( d.studentId ,d.activePeriod as SGMAcademicPeriod.readDTO).current)
  );
}
