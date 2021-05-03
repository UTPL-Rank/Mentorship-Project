import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsNavbarComponent } from './analytics-navbar/analytics-navbar.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AccompanimentsProblemsComponent } from './components/accompaniments-problems/accompaniments-problems.component';
import { MentorsPerDegreeComponent } from './components/mentors-per-degree/mentor-per-degree.component';
import { MentorsWithAccompanimentsComponent } from './components/mentors-with-accompaniments/mentors-with-accompaniments.component';
import { StudentsWithAccompanimentsComponent } from './components/students-with-accompaniments/students-with-accompaniments.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartsModule, // TODO: remove
    SharedModule,
  ],
  declarations: [
    AnalyticsRoutingModule.pages,
    MentorsPerDegreeComponent,
    MentorsWithAccompanimentsComponent,
    StudentsWithAccompanimentsComponent,
    AnalyticsNavbarComponent,
    AccompanimentsProblemsComponent,
  ],
  providers: [
    AnalyticsRoutingModule.resolvers,
    AnalyticsRoutingModule.guards,
  ],
})
export class AnalyticsModule { }
