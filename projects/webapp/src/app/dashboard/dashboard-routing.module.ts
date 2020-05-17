import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { IsMentorGuard } from '../core/guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from '../core/guards/valid-period-of-mentor.guard';
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
import { AcademicPeriodResolver } from './resolvers/academic-period.resolver';
import { ExportAccompanimentsResolver } from './resolvers/export-accompaniments.resolver';
import { HistoryAccompanimentsResolver } from './resolvers/history-accompaniments.resolver';
import { InfoAccompanimentResolver } from './resolvers/info-accompaniment.resolver';
import { InfoMentorResolver } from './resolvers/info-mentor.resolver';
import { InfoStudentResolver } from './resolvers/info-student.resolver';
import { ListStudentsResolver } from './resolvers/list-students.resolver';

const routes: Routes = [
  // redirect page, where users will wait to sign in
  { path: 'ingresar', component: SignInPage },

  // landing route, that redirect to actual home with periodID
  { path: '', canActivate: [IsSignInGuard, RedirectToLastPeriodGuard] },

  // shell component to encapsulare sub-routes
  {
    path: ':periodId',
    component: DashboardShell,
    resolve: { activePeriod: AcademicPeriodResolver },
    canActivate: [IsSignInGuard, ValidPeriodGuard],
    runGuardsAndResolvers: 'always',
    children: [
      // dashboard home page
      { path: '', component: DashboardHomePage },

      // analytics page
      {
        path: 'analiticas',
        component: AnalyticsPage,
        canActivate: [IsAdminGuard],
        children: [
          { path: 'acompañamientos', component: AccompanimentsAnalyticsPage },
          { path: 'mentores', component: MentorsAnalyticsPage },
          { path: '**', redirectTo: 'acompañamientos' }
        ]
      },

      // upload information
      // this route should be acceced by admin users
      // and the the activePeriod should have the current attribute true
      {
        path: 'subir-informacion',
        loadChildren: () => import('./../upload-information/upload-information.module').then(m => m.UploadInformationModule),
        canActivate: [IsAdminGuard, IsCurrentPeriodActiveGuard],
      },

      // view all information related with the mentor , students and coordinators
      { path: 'mentores', loadChildren: () => import('./../mentors/mentors.module').then(m => m.MentorsModule), },



      // List all accompaniments you registered with an student
      {
        path: 'historial-acompañamientos/:mentorId/:studentId',
        component: AccompanimentsHistoryPage,
        resolve: {
          student: InfoStudentResolver,
          mentor: InfoMentorResolver,
          accompaniments: HistoryAccompanimentsResolver
        },
        canActivate: [
          IsMentorGuard,
          ValidPeriodOfMentorGuard,
          ValidPeriodOfStudentGuard
        ]
      },

      // view all information of an accompaniment
      {
        path: 'ver-acompañamiento/:mentorId/:accompanimentId',
        component: ViewAccompanimentPage,
        resolve: { accompaniment: InfoAccompanimentResolver },
        canActivate: [
          IsMentorGuard,
          ValidPeriodOfMentorGuard,
          ValidPeriodOfAccompanimentGuard
        ]
      },

      // where users will validate an accompaniment
      {
        path: 'calificar-acompañamiento/:studentId/:accompanimentId/:reviewKey',
        component: ReviewAccompanimentPage,
        resolve: { accompaniment: InfoAccompanimentResolver },
        canActivate: [
          IsStudentGuard,
          UnconfirmedAccompanimentExistsGuard,
          IsCurrentPeriodActiveGuard,
          ValidPeriodOfStudentGuard,
          ValidPeriodOfAccompanimentGuard
        ]
      },

      // register a new accompaniment
      {
        path: 'registrar-acompañamiento/:mentorId',
        component: RegisterAccompanimentPage,
        resolve: {
          mentor: InfoMentorResolver,
          students: ListStudentsResolver
        },
        canActivate: [
          IsMentorGuard,
          IsCurrentPeriodActiveGuard,
          ValidPeriodOfMentorGuard
        ]
      }
    ]
  },

  // view accompaniment registry of specific semester
  {
    path: 'ficha-acompañamiento/:mentorId/:studentId/:semesterKind',
    component: AccompanimentsRegistryPage,
    resolve: {
      mentor: InfoMentorResolver,
      student: InfoStudentResolver,
      accompaniments: ExportAccompanimentsResolver
    }
  },

  { path: '**', redirectTo: '/panel-control' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule { }
