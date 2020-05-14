import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirePerformance } from "@angular/fire/performance";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AcademicPeriodsService } from "../../core/services/academic-period.service";
import { FirestoreAcademicArea } from "../../models/academic-area.model";

@Injectable({ providedIn: "root" })
export class InfoAcademicAreaResolver implements Resolve<FirestoreAcademicArea> {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance,
    private period: AcademicPeriodsService
  ) { }

  resolve({
    params: { areaId }
  }: ActivatedRouteSnapshot): Observable<FirestoreAcademicArea> {
    return this.db
      .collection("academic-areas")
      .doc(areaId)
      .get()
      .pipe(
        this.perf.trace("info academicArea"),
        map(snap => Object.assign(snap.data(), { id: snap.id }) as FirestoreAcademicArea)
      );
  }
}
