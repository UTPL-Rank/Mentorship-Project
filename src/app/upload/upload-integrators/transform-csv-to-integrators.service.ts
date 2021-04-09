import { Injectable } from '@angular/core';
import { SGMAcademicPeriod, SGMIntegrator } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { IBaseCsvTransformerService } from './../services/i-base-csv-transformer.service';

@Injectable({
  providedIn: 'root'
})
export class TransformCsvToIntegratorsService extends IBaseCsvTransformerService<SGMIntegrator.createDTO> {

  protected async transformRowToObject(row: string[]): Promise<SGMIntegrator.createDTO> {
    console.log(row);

    // create an id
    const id = this.db.createId();

    // transform all the incoming data into lowercase, and trim the text
    const data = row.map(s => s.trim().toLocaleLowerCase());

    // store in variables
    const [displayName, email, periodId] = data;

    // get the data for the academic period if exists, otherwise throw an error
    const periodReference = this.db.collection('academic-periods')
      .doc(periodId).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
    const periodSnap = await periodReference.get();
    if (!periodSnap.exists) throw new Error(`El periodo académico ${periodReference.id} no fue encontrado.`);
    const periodData = periodSnap.data();


    if (!periodData)
      throw new Error('Missing data');

    // construct a mentor with the obtained data
    return {
      id,
      email,
      displayName,
      period: { reference: periodReference, name: periodData.name },
      assignedMentorsCount: 0,
    };
  }
}
