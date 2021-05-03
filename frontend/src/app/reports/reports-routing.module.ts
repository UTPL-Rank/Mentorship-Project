import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadMentorResolver } from '../core/resolvers/preload-mentor.resolver';
import { AccompanimentsReportComponent } from './pages/accompaniments-report/accompaniments-reports.page';
import { PreloadAccompanimentsResolver } from './resolvers/preload-accompaniments.resolver';
import { PreloadStudentResolver } from './resolvers/preload-student.resolver';

const routes: Routes = [
  {
    path: 'acompañamientos/:mentorId/:studentId/:semesterKind',
    component: AccompanimentsReportComponent,
    resolve: {
      mentor: PreloadMentorResolver,
      student: PreloadStudentResolver,
      accompaniments: PreloadAccompanimentsResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {
  static pages = [
    AccompanimentsReportComponent,
  ];

  static resolvers = [

    PreloadStudentResolver,
    PreloadAccompanimentsResolver,
  ];
}
