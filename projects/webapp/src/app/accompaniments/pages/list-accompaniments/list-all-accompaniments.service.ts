import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { trace } from '@angular/fire/performance';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../../core/services/academic-periods.service';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { IListDataService } from '../../../shared/modules/i-list-data-service';
import { IStatusData } from '../../../shared/modules/i-status-data';
import { IListAllAccompanimentsOptions } from './i-list-all-accompaniments-options';

@Injectable({ providedIn: 'root' })
export class ListAllAccompanimentsService extends IListDataService<SGMAccompaniment.readDTO, IListAllAccompanimentsOptions> {
  constructor(
    private readonly firestoreDB: AngularFirestore,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly logger: BrowserLoggerService,
  ) { super(); }

  list$(options?: IListAllAccompanimentsOptions): Observable<IStatusData<Array<SGMAccompaniment.readDTO>>> {

    if (!options)
      return of({ status: 'ERROR' });

    const collectionQuery = this.firestoreDB.collection('accompaniments', q => {
      let query = q.orderBy('timeCreated', 'desc').limit(50);

      if (!!options.periodId) {
        const periodRef = this.periodsService.periodDocument(options.periodId).ref;
        query = query.where('period.reference', '==', periodRef);
      }
      if (!!options.mentorId) {
        const mentorRef = this.mentorsService.mentorRef(options.mentorId);
        query = query.where('mentor.reference', '==', mentorRef);
      }
      if (!!options.studentId) {
        const studentRef = this.studentsService.studentRef(options.studentId);
        query = query.where('student.reference', '==', studentRef);
      }

      return query;
    });

    return collectionQuery.get().pipe(
      trace('list-all-accompaniments-service'),
      map(payload => {
        const accompaniments = payload.docs.map(d => d.data() as SGMAccompaniment.readDTO);

        const response: IStatusData<Array<SGMAccompaniment.readDTO>> = {
          status: 'READY',
          data: accompaniments,
        };

        return response;
      }),
      catchError(err => {
        this.logger.error('Error fetching data', err);
        const res: IStatusData<Array<SGMAccompaniment.readDTO>> = { status: 'ERROR' };
        return of(res);
      }),
      startWith({ status: 'LOADING' } as IStatusData<Array<SGMAccompaniment.readDTO>>),
      tap(data => this.logger.log('Accompaniments data retrieve', data)),
    );
  }
}
