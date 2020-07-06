import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

const REPORTS_COLLECTION = 'reports';

interface BaseReport {
  id: string;
  creator: {
    displayName: string;
    email: string;
  };
  createdAt: firestore.Timestamp | firestore.FieldValue;
}

type CreateReport = BaseReport & { createdAt: firestore.FieldValue };

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly auth: AuthenticationService
  ) { }

  /**
   * Store a new report in the database, but include in the registration information
   * about who generated teh report
   * @param data report data to store
   */
  public create<T>(data: T): Observable<string> {
    const id = this.angularFirestore.createId();
    const createdAt = firestore.FieldValue.serverTimestamp();

    const createReport = this.auth.currentUser.pipe(
      map(({ displayName, email }) => Object.assign(data, { id, creator: { displayName, email }, createdAt })),
      mergeMap(async report => await this.angularFirestore.collection(REPORTS_COLLECTION).doc<T & CreateReport>(id).set(report)),
      map(() => id)
    );

    return createReport;
  }
}
