import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentOfMentorGuard } from './guards/student-of-mentor.guard';
import { GenerateStudentReportComponent } from './pages/generate-student-report/generate-student-report.component';
import { ViewStudentHistoryComponent } from './pages/view-student-history/view-student-history.component';
import { ViewStudentComponent } from './pages/view-student/view-student.component';

// IsMentorGuard,
// ValidPeriodOfMentorGuard,
// ValidPeriodOfStudentGuard

const ROUTES: Routes = [
  {
    path: ':studentId', canActivate: [StudentOfMentorGuard],
    children: [
      { path: 'informacion', component: ViewStudentComponent, },
      { path: 'historial', component: ViewStudentHistoryComponent, },
      { path: 'ficha-estudiante', component: GenerateStudentReportComponent, },
      { path: '', redirectTo: 'informacion' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {

  static pages = [
    ViewStudentComponent,
    ViewStudentHistoryComponent,
    GenerateStudentReportComponent,
  ];

  static resolvers = [];

  static guards = [
    StudentOfMentorGuard,
  ];

}
