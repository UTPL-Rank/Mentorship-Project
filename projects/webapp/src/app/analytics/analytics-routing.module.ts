import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccompanimentsAnalyticsComponent } from './pages/accompaniments-analytics/accompaniments-analytics.page';
import { MentorsAnalyticsPage } from './pages/mentors-analytics/mentors-analytics.page';

const routes: Routes = [
  { path: 'acompañamientos', component: AccompanimentsAnalyticsComponent },
  { path: 'mentores', component: MentorsAnalyticsPage },
  { path: '**', redirectTo: 'mentores' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule {
  static pages = [
    AccompanimentsAnalyticsComponent,
    MentorsAnalyticsPage,
  ];

  static resolvers = [];

  static guards = [];
}
