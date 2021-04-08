import { Injectable } from '@angular/core';
import { IBaseCsvTransformerService } from './../../services/i-base-csv-transformer.service'
import { SGMAcademicArea, SGMAcademicDegree, SGMAcademicPeriod, SGMMentor } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransformCsvToMentorsService extends IBaseCsvTransformerService<SGMMentor.createDTO> {

  public transform$(csv: string[][]): Observable<Array<SGMMentor.createDTO>> {

    const csvToObjects = csv.map(async row => await this.transformRowToObject(row))

    return from(Promise.all(csvToObjects));
  }

  private async transformRowToObject(row: Array<string>): Promise<SGMMentor.createDTO> {
    // create an id for this mentor
    const id = this.db.createId();

    // transform all the incoming data into lowercase, and trim the text
    const data = row.map(s => s.trim().toLocaleLowerCase());

    // store in variables
    const [displayName, email, ci, areaId, degreeId, periodId] = data;

    // get the data for the academic area if exists, otherwise throw an error
    const areaReference = this.db.collection('academic-areas').doc(areaId).ref as firestore.DocumentReference<SGMAcademicArea.readDTO>;
    const areaSnap = await areaReference.get();
    if (!areaSnap.exists) throw new Error(`El área ${areaReference.id} no existe.`);
    const areaData = areaSnap.data();

    // get the data for the academic degree if exists, otherwise throw an error
    const degreeReference = this.db.collection('academic-degrees')
      .doc(degreeId).ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
    const degreeSnap = await degreeReference.get();
    if (!degreeSnap.exists) throw new Error(`La titulación ${degreeReference.id} no existe.`);
    const degreeData = degreeSnap.data();

    // get the data for the academic period if exists, otherwise throw an error
    const periodReference = this.db.collection('academic-periods')
      .doc(periodId).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
    const periodSnap = await periodReference.get();
    if (!periodSnap.exists) throw new Error(`El periodo académico ${periodReference.id} no fue encontrado.`);
    const periodData = periodSnap.data();


    if (!areaData || !periodData || !degreeData)
      throw new Error('Missing data');

    // construct a mentor with the obtained data
    return {
      id, email, displayName, ci,
      area: { reference: areaReference, name: areaData.name },
      period: { reference: periodReference, name: periodData.name },
      degree: { reference: degreeReference, name: degreeData.name },
      stats: { accompanimentsCount: 0, assignedStudentCount: 0, lastAccompaniment: null },
      students: { cycles: [], degrees: [], withAccompaniments: [], withoutAccompaniments: [] }
    };
  }
}
