import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'projects/webapp/src/environments/environment';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    AngularFireMessagingModule
  ],
  exports: [
    // AngularFireModule,
    // AngularFirestoreModule,
    // AngularFireStorageModule,
    // AngularFireAuthModule,
    // AngularFireAnalyticsModule,
    // AngularFireFunctionsModule,
    // AngularFirePerformanceModule,
    // AngularFireMessagingModule
  ],
  providers: [ScreenTrackingService, UserTrackingService]
})
export class FirebaseModule { }
