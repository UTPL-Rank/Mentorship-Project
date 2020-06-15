import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LandingShellComponent } from './pages/landing-shell/landing-shell.component';

const routes: Routes = [
  {
    path: '',
    component: LandingShellComponent,
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
  static pages = [
    LandingShellComponent,
    HomePage,
  ];
}
