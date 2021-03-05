import { Component, Input } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
@Component({
  selector: 'sgm-info-mentor',
  template: `
    <div class="card shadow">
      <div class="card-body">
        <!-- Heading -->
        <h4 class="text-nowrap text-truncate mb-0">
          {{ mentor.displayName | titlecase }}
        </h4>

        <!-- Text -->
        <p class="text-muted mb-5">
          <small class="font-weight-bold">
            Mentor Compañero
          </small>
        </p>

        <ng-container *ngIf="mentor.degree && mentor.area">
          <!-- Heading -->
          <h6 class="font-weight-bold text-uppercase mb-1">
            Información Académica
          </h6>

          <!-- Text -->
          <p class="text-muted mb-5">
            <small class="mb-5">
              {{ mentor.degree.name | titlecase }} ·
              {{ mentor.area.name | titlecase }}
            </small>
          </p>
        </ng-container>

        <!-- email -->
        <ng-container *ngIf="mentor.email">
          <!-- Heading -->
          <h6 class="font-weight-bold text-uppercase mb-1">
            Correo Electrónico
          </h6>

          <!-- Text -->
          <p class="text-muted mb-4">
            <small>
              <a [href]="'mailto:' + (mentor?.email || '')" class="text-reset">
                {{ mentor.email }}
              </a>
            </small>
          </p>
        </ng-container>
        </div>
    </div>
  `
})
export class InfoMentorComponent {
  @Input()
  mentor!: Partial<SGMMentor.readDTO>;
}
