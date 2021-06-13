import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateReportsRoutingModule } from './generate-reports-routing.module';
import { GenerateReportsNavbarComponent } from './components/generate-reports-navbar/generate-reports-navbar.component';
import { GenerateReportsHomeComponent } from './pages/generate-reports-home/generate-reports-home.component';

import { SharedModule } from '../shared/shared.module';
import { GenerateReportsStudentComponent } from './pages/generate-reports-student/generate-reports-student.component';
import { GenerateReportsMentorComponent } from './pages/generate-reports-mentor/generate-reports-mentor.component';
import { GenerateReportsAreaComponent } from './pages/generate-reports-area/generate-reports-area.component';
import { GenerateReportsGeneralComponent } from './pages/generate-reports-general/generate-reports-general.component';
import { GenerateReportsMentorsTableComponent } from './components/generate-reports-mentors-table/generate-reports-mentors-table.component';
import { GenerateReportsStudentsTableComponent } from './components/generate-reports-students-table/generate-reports-students-table.component';

// Components
const COMPONENTS = [
  GenerateReportsNavbarComponent,
  GenerateReportsMentorsTableComponent,
  GenerateReportsStudentsTableComponent
];

// Pages
const PAGES = [
  GenerateReportsHomeComponent,
  GenerateReportsStudentComponent,
  GenerateReportsMentorComponent,
  GenerateReportsAreaComponent,
  GenerateReportsGeneralComponent
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
