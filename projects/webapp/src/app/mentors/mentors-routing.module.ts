import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from '../core/guards/valid-period-of-mentor.guard';
import { EvaluationActivitiesComponent } from './pages/final-evaluation/evaluation-activities.component';
import { EvaluationDependenciesComponent } from './pages/final-evaluation/evaluation-dependencies.component';
import { EvaluationObservationsComponent } from './pages/final-evaluation/evaluation-observations.component';
import { ListAssignedStudentsComponent } from './pages/list-assigned-students/list-assigned-students.component';
import { ListMentorsComponent } from './pages/list-mentors/list-mentors.component';
import { ViewMentorHistoryComponent } from './pages/view-mentor-history/view-mentor-history.component';
import { ViewMentorComponent } from './pages/view-mentor/view-mentor.component';

const routes: Routes = [
  // View all mentors inscribed
  { path: '', component: ListMentorsComponent, canActivate: [IsAdminGuard], },

  // View the information of a mentor, stats, and assigned students
  { path: ':mentorId', component: ViewMentorComponent, canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard], },
  { path: ':mentorId/estudiantes', component: ListAssignedStudentsComponent, canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard], },
  { path: ':mentorId/historial', component: ViewMentorHistoryComponent, canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard], },
  {
    path: ':mentorId/evaluacion-final',
    canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard],
    children: [
      { path: 'actividades', component: EvaluationActivitiesComponent },
      { path: 'dependencias', component: EvaluationDependenciesComponent },
      { path: 'observaciones', component: EvaluationObservationsComponent },
      { path: '**', redirectTo: 'actividades' },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentorsRoutingModule {
  static pages = [
    ListMentorsComponent,
    ViewMentorComponent,
    ViewMentorHistoryComponent,
    ListAssignedStudentsComponent,
    EvaluationActivitiesComponent,
    EvaluationDependenciesComponent,
    EvaluationObservationsComponent,
  ];
}
