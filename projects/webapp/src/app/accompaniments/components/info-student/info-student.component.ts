import { Component, Input } from '@angular/core';
import { Student } from '../../../models/models';

@Component({
  selector: 'sgm-info-student',
  template: `
    <div class="card shadow">
      <div class="card-body">
        <!-- Heading -->
        <h4 class="text-nowrap text-truncate mb-0">
          {{ student.displayName | titlecase }}
        </h4>

        <!-- Text -->
        <p class="text-muted mb-5">
          <small class="font-weight-bold">
            Estudiante de nuevo ingreso
          </small>
        </p>

        <ng-container *ngIf="student.degree && student.area">
          <!-- Heading -->
          <h6 class="font-weight-bold text-uppercase mb-1">
            Información Académica
          </h6>

          <!-- Text -->
          <p class="text-muted mb-5">
            <small class="mb-5">
              Estudiante de {{ student.cycle | academicCycleName }}
            </small>
            <br />
            <small class="mb-5">
              {{ student.degree.name | titlecase }} ·
              {{ student.area.name | titlecase }}
            </small>
          </p>
        </ng-container>

        <ng-container *ngIf="student.email">
          <!-- Heading -->
          <h6 class="font-weight-bold text-uppercase mb-1">
            Correo Electrónico
          </h6>

          <!-- Text -->
          <p class="text-muted mb-0">
            <small>
              <a [href]="'mailto:' + student.email" class="text-reset">
                {{ student.email }}
              </a>
            </small>
          </p>
        </ng-container>
      </div>
    </div>
  `
})
export class InfoStudentComponent {
  constructor() { }

  @Input()
  student: Partial<Student>;
}
