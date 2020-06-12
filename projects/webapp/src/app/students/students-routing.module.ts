import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStudentHistoryComponent } from './pages/view-student-history/view-student-history.component';
import { ViewStudentComponent } from './pages/view-student/view-student.component';


const ROUTES: Routes = [
  { path: ':studentId/informacion', component: ViewStudentComponent },
  { path: ':studentId/historial', component: ViewStudentHistoryComponent },
  { path: ':studentId', redirectTo: ':studentId/informacion' },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {

  static pages = [
    ViewStudentComponent,
    ViewStudentHistoryComponent,
  ];

  static resolvers = [];

}
