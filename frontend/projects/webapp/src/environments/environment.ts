// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyB0J_KPDhRlOh8K0zgEMS72AULTPTUY9KE',
    authDomain: 'dev-sgmentores-9c117.firebaseapp.com',
    databaseURL: 'https://dev-sgmentores-9c117.firebaseio.com',
    projectId: 'dev-sgmentores-9c117',
    storageBucket: 'dev-sgmentores-9c117.appspot.com',
    messagingSenderId: '1017614581508',
    appId: '1:1017614581508:web:7218a510a9dca0c9af9a51',
    measurementId: 'G-ECSP0Z6X9Z'
  },
  messaging: {
    serverKey: 'AAAA7O6OPwQ:APA91bF-JvN46zIuCXTfmwRbNGfDSqd55tfkRrsgHZvoS8jEBdvuLWz_Dwb-G4-yQYyXrI3SizqnZyA85p39PmCAMs5wr7wVffJf3Fmcz_GnPUERiMvZCD9TVxmKtoV2K98OGhVoAH26'
  },
  reports: {
    mentorEvaluation: 'http://localhost:5000/evaluacion-final.html'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.

