import { Component } from "@angular/core";

@Component({
  selector: "sgm-dashboard",
  template: `
    <sgm-dashboard-navbar class="hide-print"></sgm-dashboard-navbar>

    <sgm-loading-bar class="hide-print"></sgm-loading-bar>

    <router-outlet></router-outlet>
  `
})
export class DashboardShell {}
