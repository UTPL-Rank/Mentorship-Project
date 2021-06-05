import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { GenerateReportsHomeComponent } from './pages/generate-reports-home/generate-reports-home.component';

const ROUTES: Routes = [
  {
    path: '',
    component: GenerateReportsHomeComponent
  },
  {
    path: ':studentId',
    children: [
      { path: 'informacion' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})

export class GenerateReportsRoutingModule {

  static pages = [];

  static resolvers = [];

  static guards = [
    IsAdminGuard
  ];

}
