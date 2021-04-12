import { Injectable } from '@angular/core';
import { SGMAcademicArea, SGMAcademicDegree, SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { IBaseCsvTransformerService } from '../../services/i-base-csv-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class TransformCsvToStudentsService extends IBaseCsvTransformerService<SGMStudent.createDTO> {

  protected async transformRowToObject(row: Array<string>): Promise<SGMStudent.createDTO> {
    const [displayName, email, rawCiclo, mentorEmail, areaId, degreeId, periodId] = row;

    // create an id
    const id = `${email.split('@')[0]}-${periodId}`;

    // format cycle
    const cycle = ['sgm#first', 'sgm#second'].includes(rawCiclo) ? rawCiclo as SGMStudent.AcademicCycle : null;

    if (!cycle)
      throw new Error(`invalid cicle ${rawCiclo}`);

    // references
    const areaReference = this.db.collection('academic-areas')
      .doc(areaId).ref as firestore.DocumentReference<SGMAcademicArea.readDTO>;
    const degreeReference = this.db.collection('academic-degrees')
      .doc(degreeId).ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
    const periodReference = this.db.collection('academic-periods')
      .doc(periodId).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
    const mentorsReference = this.db.collection('mentors').ref.where('email', '==', mentorEmail)
      .where('period.reference', '==', periodReference) as firestore.CollectionReference<SGMMentor.readDTO>;

    // get all data in parallel
    const [areaSnap, degreeSnap, periodSnap, mentorsSnap] =
      await Promise.all([areaReference.get(), degreeReference.get(), periodReference.get(), mentorsReference.get()]);

    if (!areaSnap.exists) throw new Error(`El área ${areaReference.id} no existe.`);
    const areaData = areaSnap.data();

    // get degree data
    if (!degreeSnap.exists) throw new Error(`La titulación ${degreeReference.id} no existe.`);
    const degreeData = degreeSnap.data();

    // get period data
    if (!periodSnap.exists) throw new Error(`El periodo académico ${periodReference.id} no fue encontrado.`);
    const periodData = periodSnap.data();

    // get mentor data
    if (mentorsSnap.empty) throw new Error(`El mentor con correo ${mentorEmail} del periodo ${periodReference.id} no fue encontrado.`);
    const [mentorDoc] = mentorsSnap.docs;
    const mentorReference = mentorDoc.ref;
    const mentorData = mentorDoc.data();

    if (!areaData || !periodData || !degreeData)
      throw new Error('data not found');

    // create user
    return {
      displayName, email, id, cycle,
      area: { reference: areaReference, name: areaData.name },
      period: { reference: periodReference, name: periodData.name },
      degree: { reference: degreeReference, name: degreeData.name },
      mentor: { reference: mentorReference, displayName: mentorData.displayName, email: mentorData.email },
      stats: { accompanimentsCount: 0 }
    };
  }
}
