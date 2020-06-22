import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BestMentorsComponent } from './components/best-mentors/best-mentors.component';
import { EvaluationActivitiesComponent } from './components/evaluation-activities/evaluation-activities.component';
import { EvaluationDependenciesComponent } from './components/evaluation-dependencies/evaluation-dependencies.component';
import { EvaluationObservationsComponent } from './components/evaluation-observations/evaluation-observations.component';
import { MentorHeaderComponent } from './components/mentor-header/mentor-header.component';
import { MentorNavbarComponent } from './components/mentor-navbar/mentor-navbar.component';
import { MentorStatsComponent } from './components/mentor-stats/mentor-stats.component';
import { MentorsTableComponent } from './components/mentors-table/mentors-table.component';
import { StudentsTableComponent } from './components/mentors-table/students-table/students-table.component';
import { MentorsRoutingModule } from './mentors-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MentorsRoutingModule,
    SharedModule,
  ],
  declarations: [
    MentorsRoutingModule.pages,
    MentorsTableComponent,
    BestMentorsComponent,
    StudentsTableComponent,
    MentorStatsComponent,
    MentorHeaderComponent,
    MentorNavbarComponent,
    EvaluationActivitiesComponent,
    EvaluationObservationsComponent,
    EvaluationDependenciesComponent,
  ],
})
export class MentorsModule { }
