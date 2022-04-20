import { Injectable } from '@angular/core';
import { SGMAcademicArea, SGMAcademicDegree, SGMAcademicPeriod, SGMMentor } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { IBaseCsvTransformerService } from './../../services/i-base-csv-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class TransformCsvToMentorsService extends IBaseCsvTransformerService<SGMMentor.createDTO> {

  protected async transformRowToObject(row: Array<string>): Promise<SGMMentor.createDTO> {
    // transform all the incoming data into lowercase, and trim the text
    const data = row.map(s => s.trim().toLocaleLowerCase());

    // store in variables
    const [displayName, email, areaId, degreeId, firstYearString, periodId] = data;

    // create an id for this mentor
    const id = `${periodId}-${email.split('@')[0]}`;

    // get the data for the academic area if exists, otherwise throw an error
    const areaReference = this.db.collection('academic-areas').doc(areaId).ref as firestore.DocumentReference<SGMAcademicArea.readDTO>;
    const areaSnap = await areaReference.get();
    if (!areaSnap.exists) throw new Error(`La facultad ${areaReference.id} no existe.`);
    const areaData = areaSnap.data();

    // get the data for the academic degree if exists, otherwise throw an error
    const degreeReference = this.db.collection('academic-degrees')
      .doc(degreeId).ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
    const degreeSnap = await degreeReference.get();
    if (!degreeSnap.exists) throw new Error(`La carrera ${degreeReference.id} no existe.`);
    const degreeData = degreeSnap.data();

    // get the data for the academic period if exists, otherwise throw an error
    const periodReference = this.db.collection('academic-periods')
      .doc(periodId).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
    const periodSnap = await periodReference.get();
    if (!periodSnap.exists) throw new Error(`El periodo académico ${periodReference.id} no fue encontrado.`);
    const periodData = periodSnap.data();

    // get the data for the integrator
    // query an integrator with email and period
    // const integratorQuery = this.db.collection('integrators').ref
    //   .where('email', '==', integratorEmail)
    //   .where('period.reference', '==', periodReference) as firestore.CollectionReference<SGMIntegrator.readDTO>;

    // const integratorReference = await integratorQuery.get();
    // const integratorDoc: firestore.QueryDocumentSnapshot<SGMIntegrator.readDTO> | null = integratorReference.docs[0] ?? null;
    // if (!integratorDoc) throw new Error(`El docente integrador con correo ${integratorEmail} no fue encontrado.`);
    // const integratorData = integratorDoc.data();

    // if (!areaData || !periodData || !degreeData || !integratorData)
    if (!areaData || !periodData || !degreeData)
      throw new Error('Missing data');

    let firstYear = false;

    // tslint:disable-next-line:curly
    if (firstYearString === 'true') {
      firstYear =  true;
    }

    // construct a mentor with the obtained data
    return {
      id, email, displayName,
      area: { reference: areaReference, name: areaData.name },
      period: { reference: periodReference, name: periodData.name },
      degree: { reference: degreeReference, name: degreeData.name },
      stats: { accompanimentsCount: 0, assignedStudentCount: 0, lastAccompaniment: null },
      students: { cycles: [], degrees: [], withAccompaniments: [], withoutAccompaniments: [] },
      integrator: { displayName: null, email: null, id: null },
      firstYear
    } as any;
  }
}
