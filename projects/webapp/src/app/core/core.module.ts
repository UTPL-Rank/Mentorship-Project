import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IsAdminGuard } from './guards/is-admin.guard';
import { IsMentorGuard } from './guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from './guards/valid-period-of-mentor.guard';
import { FirebaseModule } from './modules/firebase.module';
import { LocateModule } from './modules/locate.module';
import { AcademicAreasService } from './services/academic-areas.service';
import { AcademicPeriodsService } from './services/academic-periods.service';
import { AuthenticationService } from './services/authentication.service';
import { BrowserLoggerService } from './services/browser-logger.service';
import { MentorsService } from './services/mentors.service';
import { PwaService } from './services/pwa.service';
import { StudentsService } from './services/students.service';
import { TitleService } from './services/title.service';


@NgModule({
  imports: [FirebaseModule, LocateModule],
  exports: [FirebaseModule, LocateModule],
  declarations: [],
  providers: [
    // Guards
    [IsAdminGuard, IsMentorGuard, ValidPeriodOfMentorGuard],
    BrowserLoggerService,
    PwaService,
    AuthenticationService,
    AcademicPeriodsService,
    AcademicAreasService,
    TitleService,
    MentorsService,
    StudentsService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // validate this module has been imported only once
    if (parentModule)
      throw new Error('Core module has been imported many times.');
  }
}
