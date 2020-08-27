import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccompanimentsAnalyticsPage } from './pages/accompaniments-analytics/accompaniments-analytics.page';
import { MentorsAnalyticsPage } from './pages/mentors-analytics/mentors-analytics.page';

const routes: Routes = [
  { path: 'acompañamientos', component: AccompanimentsAnalyticsPage },
  { path: 'mentores', component: MentorsAnalyticsPage },
  { path: '**', redirectTo: 'acompañamientos' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule {
  static pages = [
    AccompanimentsAnalyticsPage,
    MentorsAnalyticsPage,
  ];

  static resolvers = [];

  static guards = [];
}
