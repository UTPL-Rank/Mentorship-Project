import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnconfirmedAccompanimentExistsGuard } from '../accompaniments/guards/unconfirmed-accompaniment-exists.guard';
import { SharedModule } from '../shared/shared.module';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { DashboardTopbarComponent } from './components/dashboard-topbar/dashboard-topbar.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SelectedPeriodBadgeComponent } from './components/selected-period-badge/selected-period-badge.component';
import { DashboardModuleRoutingModule } from './dashboard-routing.module';
import { IsStudentGuard } from './guards/is-student.guard';
import { RedirectCurrentGuard } from './guards/redirect-current-period.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ValidPeriodGuard } from './guards/valid-period.guard';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';
import { DashboardShellComponent } from './pages/dashboard-shell.component';
import { ActivePeriodResolver } from './resolvers/active-period.resolver';
import { InfoMentorResolver } from './resolvers/info-mentor.resolver';

// Components
const COMPONENTS = [
  DashboardNavbarComponent,
  DashboardTopbarComponent,
  LoadingBarComponent,
  NotificationsComponent,
  SelectedPeriodBadgeComponent
];

// Pages
const PAGES = [
  DashboardShellComponent,
  DashboardHomePage,
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

    SharedModule
  ],
  declarations: [PAGES, COMPONENTS],
  providers: [RESOLVERS, GUARDS]
})
export class DashboardModuleModule { }
