import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IsAdminGuard } from './guards/is-admin.guard';
import { IsMentorGuard } from './guards/is-mentor.guard';
import { ValidPeriodOfMentorGuard } from './guards/valid-period-of-mentor.guard';
import { FirebaseModule } from './modules/firebase.module';
import { LocateModule } from './modules/locate.module';


@NgModule({
  imports: [FirebaseModule, LocateModule],
  exports: [FirebaseModule, LocateModule],
  declarations: [],
  providers: [
    // Guards
    [IsAdminGuard, IsMentorGuard, ValidPeriodOfMentorGuard]
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // validate this module has been imported only once
    if (parentModule)
      throw new Error('Core module has been imported many times.');
  }
}
