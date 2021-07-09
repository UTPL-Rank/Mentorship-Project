import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { GenerateReportsComponent } from './pages/generate-reports/generate-reports.component';
import { GenerateReportsHomeComponent } from './pages/generate-reports-home/generate-reports-home.component';
import { GenerateReportsStudentComponent } from './pages/generate-reports-student/generate-reports-student.component';
import { GenerateReportsMentorComponent } from './pages/generate-reports-mentor/generate-reports-mentor.component';
import { GenerateReportsAreaComponent } from './pages/generate-reports-area/generate-reports-area.component';
import { GenerateReportsGeneralComponent } from './pages/generate-reports-general/generate-reports-general.component';
import { GenerateReportsDegreeComponent } from './pages/generate-reports-degree/generate-reports-degree.component';
import { GenerateReportsFinalComponent } from './pages/generate-reports-final/generate-reports-final.component';
import { ReportsMentorComponent } from './pages/reports-mentor/reports-mentor.component';
import { ReportsDegreeComponent } from './pages/reports-degree/reports-degree.component';
import { ReportsAreaComponent } from './pages/reports-area/reports-area.component';
import { ReportsStudentComponent } from './pages/reports-student/reports-student.component';

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
        children: [
          {
            path: '',
            component: GenerateReportsStudentComponent
          },
          {
            path: ':mentorId/:studentId',
            component: ReportsStudentComponent
          }
        ]
      },
      {
        path: 'mentores',
        children: [{
          path: '',
          component: GenerateReportsMentorComponent
        },
          {
            path: ':mentorId',
            component: ReportsMentorComponent
          }
        ]
      },
      {
        path: 'titulaciones',
        children: [{
          path: '',
          component: GenerateReportsDegreeComponent
        },
          {
          path: ':degreeId',
          component: ReportsDegreeComponent
        }]
      },
      {
        path: 'areas_academicas',
        children: [{
          path: '',
          component: GenerateReportsAreaComponent
        },
          {
          path: ':areaId',
          component: ReportsAreaComponent
        }]
      },
      {
        path: 'general',
        children: [{
          path: '',
          component: GenerateReportsGeneralComponent
        }]
      },
      {
        path: 'evaluacion_final',
        children: [{
          path: '',
          component: GenerateReportsFinalComponent
        }]
      }
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
