import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AcademicPeriod, AcademicPeriods } from '../../models/academic-period.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicPeriodService {
  public academicPeriods: AcademicPeriods;
  public loaded = false;

  constructor(private db: AngularFirestore) { }

  async loadAcademicPeriods() {
    const snap = await this.db
      .collection<AcademicPeriod>('academic-periods', q => q.orderBy('date', 'desc'))
      .get()
      .toPromise();

    this.academicPeriods = snap.docs.map(p => p.data() as AcademicPeriod);
    this.loaded = true;
  }
}
