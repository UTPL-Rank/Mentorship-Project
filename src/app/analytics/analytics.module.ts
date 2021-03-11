import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsNavbarComponent } from './analytics-navbar/analytics-navbar.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AccompanimentsProblemsComponent } from './components/accompaniments-problems/accompaniments-problems.component';
import { AreasChartComponent } from './components/charts/areas-chart.component';
import { DegreesChartComponent } from './components/charts/degrees-chart.component';
import { FollowingChartComponent } from './components/charts/following-chart.component';
import { ProblemsAreaChartComponent } from './components/charts/problems-area-chart.component';
import { ProblemsChartComponent } from './components/charts/problems-chart.component';
import { ProblemsDegreeChartComponent } from './components/charts/problems-degree-chart.component';
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
    ProblemsChartComponent,
    FollowingChartComponent,
    AreasChartComponent,
    ProblemsAreaChartComponent,
    DegreesChartComponent,
    ProblemsDegreeChartComponent,
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
