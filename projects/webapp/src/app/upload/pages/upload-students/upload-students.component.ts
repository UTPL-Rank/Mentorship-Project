import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicArea, SGMAcademicDegree, SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { UploadData } from '../../../models/upload-data.interface';
import { StudentClaims } from '../../../models/user-claims';

@Component({
  selector: 'sgm-upload-students',
  templateUrl: './upload-students.component.html'
})
export class UploadStudentsComponent implements UploadData<SGMStudent.readDTO>, OnInit, OnDestroy {

  constructor(
    private readonly db: AngularFirestore,
    private readonly route: ActivatedRoute,
    private readonly usersService: UserService,
  ) { }

  private sub: Subscription | null = null;
  public period!: SGMAcademicPeriod.readDTO;

  isSaving = false;

  data: Array<SGMStudent.readDTO> | null = null;

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => this.period = data.activePeriod);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async save(): Promise<void> {
    if (!this.data) {
      alert('Primero lee el archivo de los estudiantes');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const chunks = this.data.reduce((acc, curr, idx) => {
        const currentChunk = idx % 10;
        if (!!acc[currentChunk])
          acc[currentChunk].push(curr);
        else
          acc[currentChunk] = [curr];
        return acc;
      }, [[]] as Array<Array<SGMStudent.readDTO>>);

      await Promise.all(chunks.map(async chunk => {
        const batch = this.db.firestore.batch();

        await Promise.all(chunk.map(async (student: SGMStudent.readDTO) => {
          const username = student.email.split('@')[0];
          const studentRef = this.db.collection('students').doc(student.id).ref;
          const mentorRef = student.mentor.reference;
          const claimsRef = this.usersService.claimsDocument(username).ref;

          // data to be sabed
          const claims: StudentClaims = { isStudent: true, mentorId: mentorRef.id, studentId: studentRef.id };

          const studentExistSnap = await studentRef.get();
          const studentExist = studentExistSnap.exists;
          const existingStudent = studentExistSnap.data() as SGMStudent.readDTO;

          if (studentExist)
            student.stats = existingStudent.stats;

          // transactions
          batch.set(studentRef, student, { merge: true });
          batch.set(claimsRef, claims, { merge: true });

          if (!studentExist) {
            batch.update(mentorRef, 'stats.assignedStudentCount', firestore.FieldValue.increment(1));
            batch.update(mentorRef, 'students.withAccompaniments', []);
            batch.update(mentorRef, 'students.withoutAccompaniments', firestore.FieldValue.arrayUnion(student.displayName));
            batch.update(mentorRef, 'students.cycles', firestore.FieldValue.arrayUnion(student.cycle));
            batch.update(mentorRef, 'students.degrees', firestore.FieldValue.arrayUnion(student.degree.name));
          } else {
            batch.update(mentorRef, 'students.cycles', firestore.FieldValue.arrayRemove(existingStudent.cycle));
            batch.update(mentorRef, 'students.cycles', firestore.FieldValue.arrayUnion(student.cycle));
          }
        }));

        await batch.commit();
        console.log('saved chunk');

      }));
      // this.router.navigateByUrl('/panel-control');
      alert('Todos los estudiantes de nuevo ingreso han sido guardados.');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar, vuelve a intentarlo.');
    }
  }

  async transformer(rawData: string[]): Promise<SGMStudent.createDTO> {

    // trim all data data and lowercase it, and get variables
    const data = rawData.map(s => s.trim().toLocaleLowerCase());
    const [displayName, email, rawCiclo, mentorEmail, areaId, degreeId] = data;

    const periodId = this.route.snapshot.params.periodId;

    // create an id
    const id = `${email.split('@')[0]}-${periodId}`;

    // format cycle
    const cycle = rawCiclo.includes('primero') ? 'sgm#first' : rawCiclo.includes('segundo') ? 'sgm#second' : 'sgm#third';

    // references
    const areaReference = this.db.collection('academic-areas')
      .doc(areaId).ref as firestore.DocumentReference<SGMAcademicArea.readDTO>;
    const degreeReference = this.db.collection('academic-degrees')
      .doc(degreeId).ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
    const periodReference = this.db.collection('academic-periods')
      .doc(this.period.id).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
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

  async readFile(csv: string): Promise<void> {
    try {
      const data = csv
        .split(/\r\n|\n/)
        .filter(line => line.trim() !== '')
        .splice(1)
        .map(line => line.split(/,|;/g))
        .map(v => this.transformer(v));

      this.data = await Promise.all(data);
    } catch (error) {
      alert(error.message);
      this.data = null;
    }
  }
}
