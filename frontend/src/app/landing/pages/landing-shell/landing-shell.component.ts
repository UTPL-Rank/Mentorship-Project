import { Component } from '@angular/core';

@Component({
  selector: 'sgm-landing-shell',
  template: `
    <sgm-landing-navbar></sgm-landing-navbar>

    <router-outlet></router-outlet>

    <sgm-landing-footer></sgm-landing-footer>
  `
})
export class LandingShellComponent { }
