import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SGMAcademicPeriod } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BrowserLoggerService } from './browser-logger.service';

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
  private academicPeriods: Array<SGMAcademicPeriod.readDTO> | null = [];

  /**
   * State of the service to keep track if academic periods have loaded or not
   */
  private loaded = false;

  /**
   * List all periods ordered by date
   */
  public readonly periods$: Observable<Array<SGMAcademicPeriod.readDTO>> = this.periodsCollection().valueChanges().pipe(
    shareReplay(1),
    map(periods => [...periods]),
    map(periods => periods.map(period => {
      if (period.id === 'testing' && !environment.production)
        period.current = true;

      /*/console.log(period);*/

      return period;
    }))
  );

  /**
   * start loading academic periods, and update internal service code
   */
  async loadAcademicPeriods(): Promise<void> {
    try {
      const periodsCollection = await this.periods$.pipe(take(1)).toPromise()
      this.academicPeriods = periodsCollection;

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
  get loadedPeriods(): Array<SGMAcademicPeriod.readDTO> {
    if (!this.loaded)
      throw new Error('[ERROR]: Fetch Academic Periods First');

    return this.academicPeriods as Array<SGMAcademicPeriod.readDTO>;
  }

  /**
   * Get firestore collection of academic periods
   */
  public periodsCollection(): AngularFirestoreCollection<SGMAcademicPeriod.readDTO> {
    return this.angularFirestore.collection<SGMAcademicPeriod.readDTO>('academic-periods', ref => ref.orderBy('date', 'desc'));
  }

  /**
   * @internal
   * Get firestore document of an academic period
   * @param periodId id of the document required
   */
  public periodDocument(periodId: string): AngularFirestoreDocument<SGMAcademicPeriod.readDTO> {
    return this.periodsCollection().doc<SGMAcademicPeriod.readDTO>(periodId);
  }

  /**
   * Get one academic period
   * @param periodId identifier of the academic period
   */
  public one$(periodId: string): Observable<SGMAcademicPeriod.readDTO | null> {
    const doc = this.periodDocument(periodId);
    const period = doc.valueChanges().pipe(
      shareReplay(1),
      map(res => res ?? null),
    );
    return period;
  }
}
