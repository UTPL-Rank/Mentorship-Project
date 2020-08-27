import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsService } from './analytics.service';
import { AreasChartComponent } from './components/charts/areas-chart.component';
import { DegreesChartComponent } from './components/charts/degrees-chart.component';
import { FollowingChartComponent } from './components/charts/following-chart.component';
import { MentorsDegreesChartComponent } from './components/charts/mentor-degrees-chart.component';
import { ProblemsAreaChartComponent } from './components/charts/problems-area-chart.component';
import { ProblemsChartComponent } from './components/charts/problems-chart.component';
import { ProblemsDegreeChartComponent } from './components/charts/problems-degree-chart.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartsModule,
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
    MentorsDegreesChartComponent
  ],
  providers: [
    AnalyticsRoutingModule.resolvers,
    AnalyticsRoutingModule.guards,
    AnalyticsService,
  ],
})
export class AnalyticsModule { }
