import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { UnconfirmedAccompanimentExistsGuard } from '../accompaniments/guards/unconfirmed-accompaniment-exists.guard';
import { SharedModule } from '../shared/shared.module';
import { AreasChartComponent } from './components/charts/areas-chart.component';
import { DegreesChartComponent } from './components/charts/degrees-chart.component';
import { FollowingChartComponent } from './components/charts/following-chart.component';
import { MentorsDegreesChartComponent } from './components/charts/mentor-degrees-chart.component';
import { ProblemsAreaChartComponent } from './components/charts/problems-area-chart.component';
import { ProblemsChartComponent } from './components/charts/problems-chart.component';
import { ProblemsDegreeChartComponent } from './components/charts/problems-degree-chart.component';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DashboardModuleRoutingModule } from './dashboard-routing.module';
import { IsStudentGuard } from './guards/is-student.guard';
import { RedirectCurrentGuard } from './guards/redirect-current-period.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ValidPeriodGuard } from './guards/valid-period.guard';
import { AccompanimentsAnalyticsPage } from './pages/analytics/accompaniments-analytics/accompaniments-analytics.page';
import { AnalyticsPage } from './pages/analytics/analytics.page';
import { MentorsAnalyticsPage } from './pages/analytics/mentors-analytics/mentors-analytics.page';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';
import { DashboardShell } from './pages/dashboard.page';
import { ActivePeriodResolver } from './resolvers/active-period.resolver';
import { InfoMentorResolver } from './resolvers/info-mentor.resolver';

// Components
const COMPONENTS = [

  DashboardNavbarComponent,
  LoadingBarComponent,
  NotificationsComponent,
  ...[
    ProblemsChartComponent,
    FollowingChartComponent,
    AreasChartComponent,
    ProblemsAreaChartComponent,
    DegreesChartComponent,
    ProblemsDegreeChartComponent,
    MentorsDegreesChartComponent
  ]
];

// Pages
const PAGES = [
  DashboardShell,
  DashboardHomePage,
  [AnalyticsPage, AccompanimentsAnalyticsPage, MentorsAnalyticsPage],
];

// Resolvers
const RESOLVERS = [
  ActivePeriodResolver,
  InfoMentorResolver,
];

// Guards
const GUARDS = [
  SignedInGuard,
  IsStudentGuard,
  UnconfirmedAccompanimentExistsGuard,
  RedirectCurrentGuard,

  // validate correct period of data
  ValidPeriodGuard,
];

// Dashboard module
@NgModule({
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    SharedModule
  ],
  declarations: [PAGES, COMPONENTS],
  providers: [RESOLVERS, GUARDS]
})
export class DashboardModuleModule { }
