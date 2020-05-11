import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from '../core/guards/valid-period-of-mentor.guard';
import { ListMentorsPageComponent } from './pages/list-mentors-page/list-mentors-page.component';
import { MentorProfilePageComponent } from './pages/mentor-profile-page/mentor-profile-page.component';

const routes: Routes = [
  // View all mentors inscribed
  { path: '', component: ListMentorsPageComponent, canActivate: [IsAdminGuard], },

  // View the information of an specific mentor
  { path: ':mentorId', component: MentorProfilePageComponent, canActivate: [IsMentorGuard, ValidPeriodOfMentorGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentorsRoutingModule {
  static pages = [ListMentorsPageComponent, MentorProfilePageComponent];
}
