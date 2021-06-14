import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsAdminGuard} from '../core/guards/is-admin.guard';
import {GenerateReportsComponent} from './pages/generate-reports/generate-reports.component';
import {GenerateReportsHomeComponent} from './pages/generate-reports-home/generate-reports-home.component';
import {GenerateReportsStudentComponent} from './pages/generate-reports-student/generate-reports-student.component';
import {GenerateReportsMentorComponent} from './pages/generate-reports-mentor/generate-reports-mentor.component';
import {GenerateReportsAreaComponent} from './pages/generate-reports-area/generate-reports-area.component';
import {GenerateReportsGeneralComponent} from './pages/generate-reports-general/generate-reports-general.component';

const ROUTES: Routes = [
  {
    path: '',
    component: GenerateReportsComponent,
    children: [
      {
        path: 'menú',
        children: [{
          path: '',
          component: GenerateReportsHomeComponent
        }]
      },
      {
        path: 'estudiantes',
        children: [{
          path: '',
          component: GenerateReportsStudentComponent
        }]
      },
      {
        path: 'mentores',
        children: [{
          path: '',
          component: GenerateReportsMentorComponent
        }]
      },
      {
        path: 'areas_academicas',
        children: [{
          path: '',
          component: GenerateReportsAreaComponent
        }]
      },
      {
        path: 'general',
        children: [{
          path: '',
          component: GenerateReportsGeneralComponent
        }]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})

export class GenerateReportsRoutingModule {

  static pages = [];

  static resolvers = [];

  static guards = [
    IsAdminGuard
  ];

}
