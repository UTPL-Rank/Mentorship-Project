import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AcademicPeriod, AcademicPeriods } from '../../models/academic-period.model';
import { BrowserLoggerService } from './browser-logger.service';

/** Firestore collection of academic periods name */
const ACADEMIC_PERIODS_COLLECTION_NAME = 'academic-periods';

/**
 * Manage academic periods through
 */
@Injectable({ providedIn: 'root' })
export class AcademicPeriodsService {

  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly logger: BrowserLoggerService
  ) { }

  /**
   * Academic periods loaded by the service
   */
  private academicPeriods: AcademicPeriods;

  /**
   * State of the service to keep track if academic periods have loaded or not
   */
  private loaded = false;

  /**
   * List all periods ordered by date
   */
  public readonly periods$: Observable<AcademicPeriod[]> = this.periodsCollection().valueChanges().pipe(
    shareReplay(1),
    map(acc => [...acc]),
  );

  /**
   * start loading academic periods, and update internal service code
   */
  async loadAcademicPeriods(): Promise<void> {
    const periodsCollection = this.periodsCollection().ref.orderBy('date', 'desc');
    try {
      const { docs } = await periodsCollection.get();
      this.academicPeriods = docs.map(p => p.data() as AcademicPeriod);

      this.loaded = true;
      this.logger.log('Academic Periods Loaded', this.academicPeriods);
    } catch (error) {
      this.logger.error('loading-academic-periods', error);
    }
  }

  /**
   * get whether periods have been loaded
   */
  get hasLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Read loaded periods, prevent reading periods if these haven't been loaded first
   */
  get loadedPeriods(): AcademicPeriods {
    if (!this.loaded)
      throw new Error('[ERROR]: Fetch Academic Periods First');

    return this.academicPeriods;
  }

  /**
   * Get firestore collection of academic periods
   */
  public periodsCollection(): AngularFirestoreCollection<AcademicPeriod> {
    return this.angularFirestore.collection<AcademicPeriod>(ACADEMIC_PERIODS_COLLECTION_NAME, ref => ref.orderBy('date', 'desc'));
  }

  /**
   * @internal
   * Get firestore document of an academic period
   * @param periodId id of the document required
   */
  public periodDocument(periodId: string): AngularFirestoreDocument<AcademicPeriod> {
    return this.periodsCollection().doc<AcademicPeriod>(periodId);
  }

  /**
   * Get one academic period
   * @param periodId identifier of the academic period
   */
  public one$(periodId: string): Observable<AcademicPeriod> {
    const doc = this.periodDocument(periodId);
    const period = doc.valueChanges().pipe(
      shareReplay(1),
    );
    return period;
  }
}
