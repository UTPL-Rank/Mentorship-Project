import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
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
      ValidPeriodOfAccompanimentGuard
    ]
  },
  {
    path: 'nuevo/:mentorId',
    component: NewAccompanimentComponent,
    resolve: {
      mentor: InfoMentorResolver,
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
    resolve: { accompaniment: InfoAccompanimentResolver },
    canActivate: [
      IsStudentGuard,
      UnconfirmedAccompanimentExistsGuard,
      CurrentPeriodActiveGuard,
      ValidPeriodOfStudentGuard,
      ValidPeriodOfAccompanimentGuard
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccompanimentsRoutingModule {
  static pages = [
    NewAccompanimentComponent
  ];

  static resolvers = [
    PreloadStudentsOfMentor
  ];

  static guards = [

  ];
}
