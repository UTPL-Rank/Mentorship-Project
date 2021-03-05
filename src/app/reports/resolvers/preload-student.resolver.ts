import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMStudent } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { StudentsService } from '../../core/services/students.service';

@Injectable({ providedIn: 'root' })
export class PreloadStudentResolver implements Resolve<SGMStudent.readDTO> {

  constructor(private readonly studentsService: StudentsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<SGMStudent.readDTO> {
    return this.studentsService.student(params.studentId);
  }
}
