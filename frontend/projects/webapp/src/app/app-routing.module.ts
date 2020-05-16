import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
  { path: 'panel-control', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModuleModule) },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      scrollPositionRestoration: 'top',
      paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
