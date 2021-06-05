import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateReportsRoutingModule } from './generate-reports-routing.module';
import { GenerateReportsNavbarComponent } from './components/generate-reports-navbar/generate-reports-navbar.component';
import { GenerateReportsHomeComponent } from './pages/generate-reports-home/generate-reports-home.component';

import { SharedModule } from '../shared/shared.module';

// Components
const COMPONENTS = [
  GenerateReportsNavbarComponent
];

// Pages
const PAGES = [
  GenerateReportsHomeComponent
];

@NgModule({
  declarations: [PAGES, COMPONENTS],
  imports: [
    CommonModule,
    GenerateReportsRoutingModule,
    SharedModule
  ]
})
export class GenerateReportsModule { }
