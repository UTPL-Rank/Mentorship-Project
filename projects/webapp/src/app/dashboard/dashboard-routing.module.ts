import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentPeriodActiveGuard } from '../core/guards/current-period-active.guard';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { RedirectCurrentGuard } from './guards/redirect-current-period.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ValidPeriodGuard } from './guards/valid-period.guard';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';
import { DashboardShellComponent } from './pages/dashboard-shell.component';
import { ActivePeriodResolver } from './resolvers/active-period.resolver';

const routes: Routes = [

  // ==================
  // Redirect actual period
  // ==================
  { path: '', canActivate: [SignedInGuard, RedirectCurrentGuard] },

  // ==================
  // Sign in feature
  // ==================
  { path: 'ingresar', loadChildren: () => import('../sign-in/sign-in.module').then(m => m.SignInModule) },

  { path: 'chat', loadChildren: () => import('../chat/chat.module').then(m => m.ChatModule) },

  // ==================
  // Dashboard shell
  // ==================
  {
    path: ':periodId',
    component: DashboardShellComponent,
    resolve: { activePeriod: ActivePeriodResolver },
    canActivate: [SignedInGuard, ValidPeriodGuard],
    runGuardsAndResolvers: 'always',
    children: [
      // dashboard home page
      { path: '', component: DashboardHomePage },

      // ==================
      // analytics feature
      // ==================
      {
        path: 'analiticas',
        loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsModule),
        canActivate: [IsAdminGuard],
      },

      // ==================
      // Upload information feature
      // ==================
      {
        path: 'subir-informacion', loadChildren: () => import('../upload/upload.module').then(m => m.UploadModule),
        canActivate: [IsAdminGuard, CurrentPeriodActiveGuard]
      },

      // ==================
      // Mentors feature
      // ==================
      { path: 'mentores', loadChildren: () => import('./../mentors/mentors.module').then(m => m.MentorsModule) },
      { path: 'ver-mentores', redirectTo: 'mentores' },
      { path: 'ver-estudiantes/:mentorId', redirectTo: 'mentores/:mentorId' },

      // =====================
      // Student Feature
      // =====================
      { path: 'estudiantes', loadChildren: () => import('./../students/students.module').then(m => m.StudentsModule) },
      { path: 'historial-acompañamientos/:mentorId/:studentId', redirectTo: 'estudiantes/:studentId' },

      // ==================
      // Accompaniments feature
      // ==================
      { path: 'acompañamientos', loadChildren: () => import('./../accompaniments/accompaniments.module').then(m => m.AccompanimentsModule) },
      { path: 'registrar-acompañamiento/:mentorId', redirectTo: 'acompañamientos/nuevo/:mentorId' },
      { path: 'ver-acompañamiento/:mentorId/:accompanimentId', redirectTo: 'acompañamientos/ver/:mentorId/:accompanimentId' },
      { path: 'calificar-acompañamiento/:studentId/:accompanimentId/:reviewKey', redirectTo: 'acompañamientos/calificar/:studentId/:accompanimentId/:reviewKey' },
    ]
  },

  // =====================
  // Reports feature
  // =====================
  { path: 'reportes', loadChildren: () => import('./../reports/reports.module').then(m => m.ReportsModule) },
  {
    path: 'ficha-acompañamiento/:mentorId/:studentId/:semesterKind',
    redirectTo: 'reportes/acompañamientos/:mentorId/:studentId/:semesterKind'
  },

  // =====================
  // default redirect route dashboard
  // =====================
  { path: '**', redirectTo: '/panel-control' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule { }
