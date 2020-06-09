import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BestMentorsComponent } from './components/best-mentors/best-mentors.component';
import { MentorStatsComponent } from './components/mentor-stats/mentor-stats.component';
import { MentorsTableComponent } from './components/mentors-table/mentors-table.component';
import { StudentsTableComponent } from './components/mentors-table/students-table/students-table.component';
import { MentorsRoutingModule } from './mentors-routing.module';
import { MentorsService } from './services/mentors.service';
import { StudentsService } from './services/students.service';

@NgModule({
  imports: [CommonModule, MentorsRoutingModule, SharedModule],
  declarations: [
    MentorsRoutingModule.pages,
    MentorsTableComponent,
    BestMentorsComponent,
    StudentsTableComponent,
    MentorStatsComponent
  ],
  providers: [
    MentorsService,
    StudentsService
  ],
})
export class MentorsModule { }
