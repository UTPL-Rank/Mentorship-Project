import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { StudentOfMentorGuard } from './guards/student-of-mentor.guard';
import { ConfigureStudentComponent } from './pages/configure-student/configure-student.component';
import { GenerateStudentReportComponent } from './pages/generate-student-report/generate-student-report.component';
import { ListStudentsComponent } from './pages/list-students/list-students.components';
import { ViewStudentComponent } from './pages/view-student/view-student.component';

const ROUTES: Routes = [
  { path: '', component: ListStudentsComponent, },
  {
    path: ':studentId', canActivate: [StudentOfMentorGuard],
    children: [
      { path: 'informacion', component: ViewStudentComponent, },
      { path: 'ficha-estudiante', component: GenerateStudentReportComponent, },
      { path: 'configurar', component: ConfigureStudentComponent, canActivate: [IsAdminGuard] },
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
    ListStudentsComponent,
    ViewStudentComponent,
    GenerateStudentReportComponent,
    ConfigureStudentComponent,

  ];

  static resolvers = [];

  static guards = [
    StudentOfMentorGuard,
  ];

}
