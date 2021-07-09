import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateReportsRoutingModule } from './generate-reports-routing.module';

import { GenerateReportsNavbarComponent } from './components/generate-reports-navbar/generate-reports-navbar.component';
import { GenerateReportsMentorsTableComponent } from './components/generate-reports-mentors-table/generate-reports-mentors-table.component';
import { GenerateReportsStudentsTableComponent } from './components/generate-reports-students-table/generate-reports-students-table.component';
import { GenerateReportsDegreesTableComponent } from './components/generate-reports-degrees-table/generate-reports-degrees-table.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { CoverComponent } from './components/cover/cover.component';
import { ReportComponent } from './components/report/report.component';

import { SharedModule } from '../shared/shared.module';

import { GenerateReportsHomeComponent } from './pages/generate-reports-home/generate-reports-home.component';
import { GenerateReportsStudentComponent } from './pages/generate-reports-student/generate-reports-student.component';
import { GenerateReportsMentorComponent } from './pages/generate-reports-mentor/generate-reports-mentor.component';
import { GenerateReportsAreaComponent } from './pages/generate-reports-area/generate-reports-area.component';
import { GenerateReportsGeneralComponent } from './pages/generate-reports-general/generate-reports-general.component';
import { GenerateReportsComponent } from './pages/generate-reports/generate-reports.component';
import { GenerateReportsDegreeComponent } from './pages/generate-reports-degree/generate-reports-degree.component';
import { GenerateReportsFinalComponent } from './pages/generate-reports-final/generate-reports-final.component';
import { ReportsStudentComponent } from './pages/reports-student/reports-student.component';
import { ReportsMentorComponent } from './pages/reports-mentor/reports-mentor.component';
import { ReportsDegreeComponent } from './pages/reports-degree/reports-degree.component';
import { ReportsAreaComponent } from './pages/reports-area/reports-area.component';


// Components
const COMPONENTS = [
  GenerateReportsNavbarComponent,
  GenerateReportsDegreesTableComponent,
  GenerateReportsMentorsTableComponent,
  GenerateReportsStudentsTableComponent,
  StudentReportComponent,
  CoverComponent,
  ReportComponent
];

// Pages
const PAGES = [
  GenerateReportsComponent,
  GenerateReportsHomeComponent,
  GenerateReportsStudentComponent,
  GenerateReportsMentorComponent,
  GenerateReportsDegreeComponent,
  GenerateReportsAreaComponent,
  GenerateReportsGeneralComponent,
  GenerateReportsFinalComponent,
  ReportsStudentComponent,
  ReportsMentorComponent,
  ReportsDegreeComponent,
  ReportsAreaComponent
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
