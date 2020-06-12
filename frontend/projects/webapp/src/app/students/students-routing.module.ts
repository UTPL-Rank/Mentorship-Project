import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStudentComponent } from './pages/view-student/view-student.component';


const ROUTES: Routes = [
  { path: ':studentId/informacion', component: ViewStudentComponent },
  { path: ':studentId/historial', component: ViewStudentComponent },
  { path: ':studentId', redirectTo: ':studentId/informacion' },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {

  static pages = [
    ViewStudentComponent,
  ];

  static resolvers = [];

}
