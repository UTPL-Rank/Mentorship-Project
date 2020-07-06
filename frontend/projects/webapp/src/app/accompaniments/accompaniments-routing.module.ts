import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentPeriodActiveGuard } from '../core/guards/current-period-active.guard';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from '../core/guards/valid-period-of-mentor.guard';
import { PreloadMentorResolver } from '../core/resolvers/preload-mentor.resolver';
import { IsStudentGuard } from '../dashboard/guards/is-student.guard';
import { UnconfirmedAccompanimentExistsGuard } from './guards/unconfirmed-accompaniment-exists.guard';
import { ValidAccompanimentGuard } from './guards/valid-accompaniment.guard';
import { ValidPeriodOfStudentGuard } from './guards/valid-period-of-student.guard';
import { NewAccompanimentComponent } from './pages/new-accompaniment/new-accompaniment.component';
import { ReviewAccompanimentComponent } from './pages/review-accompaniment/review-accompaniment.component';
import { ViewAccompanimentComponent } from './pages/view-accompaniment/view-accompaniment.component';
import { PreloadStudentsOfMentor } from './resolvers/preload-students-of-mentor.resolver';

const routes: Routes = [
  {
    path: 'ver/:mentorId/:accompanimentId',
    component: ViewAccompanimentComponent,
    canActivate: [
      IsMentorGuard,
      ValidPeriodOfMentorGuard,
      ValidAccompanimentGuard
    ]
  },
  {
    path: 'nuevo/:mentorId',
    component: NewAccompanimentComponent,
    resolve: {
      mentor: PreloadMentorResolver,
      students: PreloadStudentsOfMentor
    },
    canActivate: [
      IsMentorGuard,
      CurrentPeriodActiveGuard,
      ValidPeriodOfMentorGuard
    ]
  },
  {
    path: 'calificar/:studentId/:accompanimentId/:reviewKey',
    component: ReviewAccompanimentComponent,
    canActivate: [
      IsStudentGuard,
      UnconfirmedAccompanimentExistsGuard,
      CurrentPeriodActiveGuard,
      ValidPeriodOfStudentGuard,
      ValidAccompanimentGuard
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccompanimentsRoutingModule {
  static pages = [
    NewAccompanimentComponent,
    ViewAccompanimentComponent,
    ReviewAccompanimentComponent,
  ];

  static resolvers = [
    PreloadStudentsOfMentor
  ];

  static guards = [
    ValidPeriodOfMentorGuard,
    ValidAccompanimentGuard,
    UnconfirmedAccompanimentExistsGuard,
  ];
}
