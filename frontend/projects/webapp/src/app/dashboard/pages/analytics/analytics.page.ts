import { Component } from "@angular/core";

@Component({
  selector: "sgm-analytics",
  template: `
    <div class="container-fluid my-5">
      <h2>Panel de Analíticas!</h2>

      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            routerLink="/panel-control/analiticas/acompañamientos"
            routerLinkActive="active"
          >
            Acompañamientos
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            routerLink="/panel-control/analiticas/mentores"
            routerLinkActive="active"
          >
            Mentores
          </a>
        </li>
      </ul>

      <router-outlet></router-outlet>
    </div>
  `
})
export class AnalyticsPage {}
