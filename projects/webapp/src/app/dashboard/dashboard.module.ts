import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { AccompanimentFormComponent } from './components/accompaniment-form/accompaniment-form.component';
import { AccompanimentsTableComponent } from './components/accompaniments-table/accompaniments-table.component';
import { AreasChartComponent } from './components/charts/areas-chart.component';
import { DegreesChartComponent } from './components/charts/degrees-chart.component';
import { FollowingChartComponent } from './components/charts/following-chart.component';
import { MentorsDegreesChartComponent } from './components/charts/mentor-degrees-chart.component';
import { ProblemsAreaChartComponent } from './components/charts/problems-area-chart.component';
import { ProblemsChartComponent } from './components/charts/problems-chart.component';
import { ProblemsDegreeChartComponent } from './components/charts/problems-degree-chart.component';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { InfoAccompanimentComponent } from './components/info-accompaniment/info-accompaniment.component';
import { InfoStudentComponent } from './components/info-student/info-student.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { ReviewFormCardComponent } from './components/review-form-card/review-form-card.component';
import { SigCanvasComponent } from './components/sig-canvas/sig-canvas.component';
import { ViewRegistryFormComponent } from './components/view-registry-form/view-registry-form.component';
import { DashboardModuleRoutingModule } from './dashboard-routing.module';
import { IsCurrentPeriodActiveGuard } from './guards/is-current-period-active.guard';
import { IsSignInGuard } from './guards/is-sign-in.guard';
import { IsStudentGuard } from './guards/is-student.guard';
import { RedirectToLastPeriodGuard } from './guards/redirect-to-last-period.guard';
import { UnconfirmedAccompanimentExistsGuard } from './guards/unconfirmed-accompaniment-exists.guard';
import { ValidPeriodOfAccompanimentGuard } from './guards/valid-period-of-accompaniment.guard';
import { ValidPeriodOfStudentGuard } from './guards/valid-period-of-student.guard';
import { ValidPeriodGuard } from './guards/valid-period.guard';
import { AccompanimentsHistoryPage } from './pages/accompaniments-history/accompaniments-history.page';
import { AccompanimentsRegistryPage } from './pages/accompaniments-registry/accompaniments-registry.page';
import { AccompanimentsAnalyticsPage } from './pages/analytics/accompaniments-analytics/accompaniments-analytics.page';
import { AnalyticsPage } from './pages/analytics/analytics.page';
import { MentorsAnalyticsPage } from './pages/analytics/mentors-analytics/mentors-analytics.page';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';
import { DashboardShell } from './pages/dashboard.page';
import { RegisterAccompanimentPage } from './pages/register-accompaniment/register-accompaniment.page';
import { ReviewAccompanimentPage } from './pages/review-accompaniment/review-accompaniment.page';
import { SignInPage } from './pages/sign-in/sign-in.component';
import { ViewAccompanimentPage } from './pages/view-accompaniment/view-accompaniment.page';
import { FollowingNamePipe } from './pipes/following-name.pipe';
import { QualificationValuePipe } from './pipes/qualification-value.pipe';
import { SemesterNamePipe } from './pipes/semester-name.pipe';
import { AcademicPeriodResolver } from './resolvers/academic-period.resolver';
import { ExportAccompanimentsResolver } from './resolvers/export-accompaniments.resolver';
import { HistoryAccompanimentsResolver } from './resolvers/history-accompaniments.resolver';
import { InfoAccompanimentResolver } from './resolvers/info-accompaniment.resolver';
import { InfoMentorResolver } from './resolvers/info-mentor.resolver';
import { InfoStudentResolver } from './resolvers/info-student.resolver';
import { ListStudentsResolver } from './resolvers/list-students.resolver';

// Components
const COMPONENTS = [
  InfoStudentComponent,
  InfoAccompanimentComponent,
  SigCanvasComponent,
  DashboardNavbarComponent,
  AccompanimentFormComponent,
  LoadingBarComponent,
  AccompanimentsTableComponent,
  ReviewFormCardComponent,
  ViewRegistryFormComponent,
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

// Pipes
const PIPES = [
  FollowingNamePipe,
  QualificationValuePipe,
  SemesterNamePipe
];

// Pages
const PAGES = [
  SignInPage,
  [
    DashboardShell,
    DashboardHomePage,
    [AnalyticsPage, AccompanimentsAnalyticsPage, MentorsAnalyticsPage],
    AccompanimentsHistoryPage,
    ViewAccompanimentPage,
    ReviewAccompanimentPage,
    RegisterAccompanimentPage,
    AccompanimentsRegistryPage
  ]
];

// Resolvers
const RESOLVERS = [
  AcademicPeriodResolver,
  ListStudentsResolver,
  HistoryAccompanimentsResolver,
  ExportAccompanimentsResolver,
  InfoMentorResolver,
  InfoStudentResolver,
  InfoAccompanimentResolver
];

// Guards
const GUARDS = [
  IsSignInGuard,
  IsStudentGuard,
  UnconfirmedAccompanimentExistsGuard,
  RedirectToLastPeriodGuard,

  // validate correct period of data
  ValidPeriodGuard,
  IsCurrentPeriodActiveGuard,
  ValidPeriodOfAccompanimentGuard,
  ValidPeriodOfStudentGuard
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
  declarations: [PAGES, COMPONENTS, PIPES],
  providers: [RESOLVERS, GUARDS]
})
export class DashboardModuleModule { }
