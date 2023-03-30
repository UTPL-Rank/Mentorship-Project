import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireFunctions } from "@angular/fire/functions";
import { AngularFirePerformance } from "@angular/fire/performance";
import {
  SGMAcademicDegree,
  SGMMentor,
  SGMAcademicPeriod,
} from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase";
import { Observable } from "rxjs";
import { map, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";
import { AcademicPeriodsService } from "./academic-periods.service";
import { ReportsService } from "./reports.service";
import { AcademicAreasService } from "./academic-areas.service";
import { ActivatedRoute, Params } from "@angular/router";

const DEGREES_COLLECTION_NAME = "academic-degrees";

@Injectable({ providedIn: "root" })
export class DegreesService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly functions: AngularFireFunctions,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly reportsService: ReportsService,
    private readonly academicAreasService: AcademicAreasService,
    private readonly route: ActivatedRoute
  ) {}

  public getDegreesCollection(): AngularFirestoreCollection<SGMAcademicDegree.readDTO> {
    return this.angularFirestore.collection<SGMAcademicDegree.readDTO>(
      DEGREES_COLLECTION_NAME
    );
  }

  /**
   * Get degrees
   */

  public getAllDegrees(period: any): Observable<Array<SGMAcademicDegree.readDTO>>  {
    console.log("denis:", period.activePeriod.date.toDate())
    

    return this.getDegreesCollection()

      .valueChanges()
      .pipe(
        mergeMap(async (doc) => {
          await this.perf.trace("list-all-degrees");
          let oldareas = [
            "Área Administrativa",
            "Área Biológica y Biomédica",
            "Área Biológica y Biomédica",
            "Área Sociohumanística",
            "Área Técnica",
          ];
          let newareas = [
            "Facultad de Ingenierías y Arquitectura",
            "facultad de ciencias jurídicas",
            "Facultad de Ciencias de la Salud",
            "Facultad de Ciencias Sociales, Educación y Humanidades",
            "Facultad de Ciencias Económicas y Empresariales",
            "Facultad de Ciencias Exactas y Naturales"
          ];

          console.log("desde servicio boolean: ", (period.activePeriod.date.toDate() > new Date(2021, 10, 1)) )
          return doc.filter((d) => {
            if ( !(period.activePeriod.date.toDate() > new Date(2021, 8, 1)) ) {
              
              console.log("entro de una")
              if (!newareas.includes(d.area.name)) {
                return d;
              }
              
            } else {

              console.log("entro al else")
              if (!oldareas.includes(d.area.name)) {
                return d;
              }
            }
            
          });
        }),
        shareReplay(1),
        map((degrees) => [...degrees])
      );
  }




  private degreeDocument(
    degreeId: string
  ): AngularFirestoreDocument<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection().doc(degreeId);
  }

  public degree(degreeId: string): Observable<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection()
      .doc(degreeId)
      .get()
      .pipe(map((snap) => snap.data() as SGMAcademicDegree.readDTO));
  }

  public degreeRef(
    degreeId: string
  ): firestore.DocumentReference<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection().doc(degreeId)
      .ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
  }

  /**
   * get information about an specific degree
   * @param degreeId identifier of requested degree
   */
  public degreeStream(
    degreeId: string
  ): Observable<SGMAcademicDegree.readDTO | null> {
    return this.degreeDocument(degreeId)
      .valueChanges()
      .pipe(
        mergeMap(async (doc) => {
          await this.perf.trace("load-degree-information");
          return doc ?? null;
        }),
        shareReplay(1)
      );
  }

  public getDegreesOfArea(
    areaId: string
  ): Observable<Array<SGMAcademicDegree.readDTO>> {
    const areaRef = this.academicAreasService.getAreaDocumentReference(areaId);

    return this.angularFirestore
      .collection<SGMAcademicDegree.readDTO>(
        DEGREES_COLLECTION_NAME,
        (query) => {
          return query.orderBy("name").where("area.reference", "==", areaRef);
        }
      )
      .valueChanges()
      .pipe(
        mergeMap(async (doc) => {
          await this.perf.trace("list-degrees-of-area");
          return doc;
        }),
        shareReplay(1)
      );
  }
}
