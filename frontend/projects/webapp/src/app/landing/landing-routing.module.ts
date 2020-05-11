import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LandingShell } from './pages/landing.shell';

const routes: Routes = [
  {
    path: '',
    component: LandingShell,
    children: [
      { path: '', component: HomePage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
  static components = [LandingShell, HomePage];
}
