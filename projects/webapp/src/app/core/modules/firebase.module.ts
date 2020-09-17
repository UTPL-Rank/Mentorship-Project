import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireStorageModule } from '@angular/fire/storage';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDSzoAXm8KmN5Z8dWCVckrygK-ESDUngag',
  authDomain: 'sgmentores.firebaseapp.com',
  databaseURL: 'https://sgmentores.firebaseio.com',
  projectId: 'sgmentores',
  storageBucket: 'sgmentores.appspot.com',
  messagingSenderId: '395423068727',
  appId: '1:395423068727:web:6052e03ffd5a6ffb8d85b2',
  measurementId: 'G-FKJKMMSBLH'
};

@NgModule({
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    AngularFireMessagingModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    // { provide: DEBUG_MODE, useValue: true },
    // {
    //   provide: FirestoreSettingsToken,
    //   useValue: environment.production ? undefined : {
    //     host: 'localhost:8080',
    //     ssl: false
    //   }
    // },
    // { provide: ORIGIN, useValue: 'http://localhost:4200' }
  ]
})
export class FirebaseModule { }
