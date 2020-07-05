import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from '../core/guards/valid-period-of-mentor.guard';
import { FinalEvaluationComponent } from './pages/final-evaluation/final-evaluation.component';
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
  { path: ':mentorId/evaluacion-final', component: FinalEvaluationComponent, canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard], },
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
    FinalEvaluationComponent,
  ];
}
