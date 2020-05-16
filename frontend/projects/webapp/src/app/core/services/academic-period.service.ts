import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { AcademicPeriod, AcademicPeriods } from '../../models/academic-period.model';

/**
 * Firestore collection of academic periods name
 */
const ACADEMIC_PERIODS_COLLECTION_NAME = 'academic-periods';

/**
 * @Service manage academic periods through
 */
@Injectable({ providedIn: 'root' })
export class AcademicPeriodsService {

  constructor(private readonly angularFirestore: AngularFirestore) { }

  /**
   * Academic periods loaded by the service
   */
  private academicPeriods: AcademicPeriods;

  /**
   * State of the service to keep track if academic periods have loaded successfully
   */
  private loaded = false;

  /**
   * start loading academic periods, and update internal service code
   */
  async loadAcademicPeriods(): Promise<void> {
    const snap = await this.periodsCollectionReference()
      .orderBy('date', 'desc')
      .get();

    this.academicPeriods = snap.docs.map(p => p.data() as AcademicPeriod);
    this.loaded = true;
  }

  /**
   * read state of the service, whether periods have been loaded
   */
  get hasLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Read loaded periods, prevent reading periods if these haven't been loaded first
   */
  get loadedPeriods(): AcademicPeriods {
    if (!this.loaded) throw new Error('[ERROR]: Fetch Academic Periods First');
    return this.academicPeriods;
  }

  /**
   * Get firestore collection of academic periods
   */
  public periodsCollection(): AngularFirestoreCollection<AcademicPeriod> {
    return this.angularFirestore.collection<AcademicPeriod>(ACADEMIC_PERIODS_COLLECTION_NAME);
  }

  /**
   * Get firestore reference to a collection of academic periods
   */
  public periodsCollectionReference(): CollectionReference {
    return this.periodsCollection().ref;
  }

  /**
   * Get firestore document of an academic period
   * @param periodId id of the document required
   */
  public periodDocument(periodId: string): AngularFirestoreDocument<AcademicPeriod> {
    return this.periodsCollection().doc<AcademicPeriod>(periodId);
  }
}
