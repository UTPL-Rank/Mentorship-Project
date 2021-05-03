import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';
import { LandingNavbarComponent } from './components/landing-navbar/landing-navbar.component';
import { LandingRoutingModule } from './landing-routing.module';

// Components
const COMPONENTS = [LandingNavbarComponent, LandingFooterComponent];


// landing module
@NgModule({
  declarations: [LandingRoutingModule.pages, COMPONENTS],
  imports: [CommonModule, LandingRoutingModule]
})
export class LandingModule { }
