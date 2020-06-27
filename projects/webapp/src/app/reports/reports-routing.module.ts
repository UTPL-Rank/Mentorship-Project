import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccompanimentsReportComponent } from './pages/accompaniments-report/accompaniments-reports.page';
import { MentorReportComponent } from './pages/mentor-report/mentor-report.component';
import { PreloadAccompanimentsResolver } from './resolvers/preload-accompaniments.resolver';
import { PreloadEvaluationActivitiesResolver } from './resolvers/preload-evaluation-activities.resolver';
import { PreloadEvaluationDependenciesResolver } from './resolvers/preload-evaluation-dependencies.resolver';
import { PreloadEvaluationObservationsResolver } from './resolvers/preload-evaluation-observations.resolver';
import { PreloadMentorResolver } from './resolvers/preload-mentor.resolver';
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
  {
    path: 'evaluacion-final/:mentorId',
    component: MentorReportComponent,
    resolve: {
      mentor: PreloadMentorResolver,
      evaluationActivities: PreloadEvaluationActivitiesResolver,
      evaluationDependencies: PreloadEvaluationDependenciesResolver,
      evaluationObservations: PreloadEvaluationObservationsResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {
  static pages = [
    AccompanimentsReportComponent,
    MentorReportComponent,
  ];

  static resolvers = [
    PreloadMentorResolver,
    PreloadStudentResolver,
    PreloadAccompanimentsResolver,
    PreloadEvaluationActivitiesResolver,
    PreloadEvaluationDependenciesResolver,
    PreloadEvaluationObservationsResolver,
  ];
}
