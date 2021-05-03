import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuideRegisterAccompanimentComponent } from './pages/guide-register-accompaniment/guide-register-accompaniment.component';
import { GuideSignInComponent } from './pages/guide-sign-in/guide-sign-in.component';
import { HomePage } from './pages/home/home.page';
import { LandingShellComponent } from './pages/landing-shell/landing-shell.component';

const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'articulo', children: [
      { path: 'iniciar-sesion', component: GuideSignInComponent },
      { path: 'registrar-acompañamiento', component: GuideRegisterAccompanimentComponent },
    ]
  }
];

const routesWithShell: Routes = [
  { path: '', component: LandingShellComponent, children: routes },
];

@NgModule({
  imports: [RouterModule.forChild(routesWithShell)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
  static pages = [
    LandingShellComponent,
    HomePage,
    GuideRegisterAccompanimentComponent,
    GuideSignInComponent,
  ];
}
