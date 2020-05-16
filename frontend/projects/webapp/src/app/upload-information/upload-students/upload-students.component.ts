import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { AcademicAreaReference, AcademicPeriod, AcademicPeriodReference, FirestoreAcademicDegreeReference, MentorQuery, Student, StudentClaims, UploadData } from '../../models/models';

@Component({
  selector: 'sgm-upload-students',
  templateUrl: './upload-students.component.html'
})
export class UploadStudentsComponent
  implements UploadData<Student>, OnInit, OnDestroy {
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  private sub: Subscription;
  public period: AcademicPeriod;

  isSaving = false;

  data: Student[];

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => this.period = data.activePeriod);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async save(): Promise<void> {
    if (!this.data) {
      alert('Primero lee el archivo de los estudiantes');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const batch = this.db.firestore.batch();

      this.data.forEach(student => {
        const studentRef = this.db.collection('students').doc(student.id).ref;
        const mentorRef = student.mentor.reference;
        const claimsRef = this.db.collection('claims').doc(student.email).ref;

        // data to be sabed
        const claims: StudentClaims = { isStudent: true, mentorId: mentorRef.id, studentId: studentRef.id };

        // transactions
        batch.set(studentRef, student);
        batch.set(claimsRef, claims, { merge: true });
        batch.update(mentorRef, 'stats.assignedStudentCount', firestore.FieldValue.increment(1));
      });

      await batch.commit();
      alert('Todos los estudiantes de nuevo ingreso han sido guardados.');
      // this.router.navigateByUrl('/panel-control');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar, vuelve a intentarlo.');
    }
  }

  async transformer(rawData: string[]): Promise<Student> {
    // create an id
    const id = this.db.createId();

    // trim all data data and lowercase it, and get variables
    const data = rawData.map(s => s.trim().toLocaleLowerCase());
    const [displayName, email, rawCiclo, mentorEmail, areaId, degreeId] = data;

    // format cycle
    const cycle = rawCiclo.includes('primero') ? 'sgm#first' : rawCiclo.includes('segundo') ? 'sgm#second' : 'sgm#third';

    // references
    const areaReference = this.db.collection('academic-areas').doc(areaId).ref as AcademicAreaReference;
    const degreeReference = this.db.collection('academic-degrees').doc(degreeId).ref as FirestoreAcademicDegreeReference;
    const periodReference = this.db.collection('academic-periods').doc(this.period.id).ref as AcademicPeriodReference;
    const mentorsReference = this.db.collection('mentors').ref.where('email', '==', mentorEmail)
      .where('period.reference', '==', periodReference) as MentorQuery;

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

    // create user
    return {
      displayName, email, id, cycle,
      area: { reference: areaReference, name: areaData.name },
      period: { reference: periodReference, name: periodData.name, date: periodData.date },
      degree: { reference: degreeReference, name: degreeData.name },
      mentor: { reference: mentorReference, displayName: mentorData.displayName, email: mentorData.email },
      stats: { accompanimentsCount: 0 }
    };
  }

  async readFile(csv: string): Promise<void> {
    try {
      const data = csv
        .split(/\r\n|\n/)
        .filter(line => line.trim() !== '')
        .splice(1)
        .map(line => line.split(';'))
        .map(v => this.transformer(v));

      this.data = await Promise.all(data);
    } catch (error) {
      alert(error.message);
      this.data = null;
    }
  }
}
