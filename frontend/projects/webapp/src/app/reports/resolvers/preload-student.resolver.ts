import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentsService } from '../../core/services/students.service';
import { Student } from '../../models/student.model';

@Injectable({ providedIn: 'root' })
export class PreloadStudentResolver implements Resolve<Student> {

  constructor(private readonly studentsService: StudentsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Student> {
    return this.studentsService.student(params.studentId);
  }
}
