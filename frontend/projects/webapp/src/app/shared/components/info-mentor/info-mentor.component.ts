import { Component, Input } from '@angular/core';
import { Mentor } from '../../../models/models';

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

        <!-- Heading -->
        <h6 class="font-weight-bold text-uppercase mb-1">
          Correo Electrónico
        </h6>

        <!-- Text -->
        <p class="text-muted mb-4">
          <small>
            <a [href]="'mailto:' + mentor.email" class="text-reset">
              {{ mentor.email }}
            </a>
          </small>
        </p>


        <p class="text-muted mb-0">
          <small>
            <a class="text-nowrap"
            [routerLink]="['/panel-control',mentor.period.reference.id,'mentores',mentor.id,'historial']">
              Historial acompañamientos
            </a>
          </small>
        </p>
      </div>
    </div>
  `
})
export class InfoMentorComponent {
  @Input()
  mentor: Mentor;
}
