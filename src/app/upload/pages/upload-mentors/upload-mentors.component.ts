import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicArea, SGMAcademicDegree, SGMAcademicPeriod, SGMMentor } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { UploadData } from '../../../models/upload-data.interface';
import { MentorClaims } from '../../../models/user-claims';

@Component({
  selector: 'sgm-upload-mentors',
  templateUrl: './upload-mentors.component.html'
})
export class UploadMentorsComponent implements UploadData<SGMMentor.createDTO>, OnInit, OnDestroy {
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private readonly usersService: UserService,
  ) { }

  isSaving = false;
  data: Array<SGMMentor.createDTO> | null = null;

  private sub: Subscription | null = null;
  public period!: SGMAcademicPeriod.readDTO;

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => {
      this.period = data.activePeriod;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async save(): Promise<void> {
    if (!this.data) {
      alert('Primero lee el archivo de los mentores');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const batch = this.db.firestore.batch();

      // TODO: validate a mentor is not repeated
      this.data.forEach(mentor => {
        // references to all the documents that will be updated when a new mentor is created
        const username = mentor.email.split('@')[0];
        const mentorRef = this.db.collection('mentors').doc(mentor.id).ref;
        const claimsRef = this.usersService.claimsDocument(username).ref;

        // data to be uploaded
        const claims: MentorClaims = { isMentor: true, mentorId: mentor.id };

        // batch writes
        // TODO: add type validation
        batch.set(mentorRef, mentor);
        batch.set(claimsRef, claims, { merge: true });
      });


      await batch.commit();
      alert('Todos los mentores han sido guardados.');
      // this.router.navigateByUrl('/panel-control');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar los mentores, vuelve a intentarlo.');
    }
  }

  async transformer(rawData: string[]): Promise<SGMMentor.createDTO> {
    // create an id for this mentor
    const id = this.db.createId();

    // transform all the incoming data into lowercase, and trim the text
    const data = rawData.map(s => s.trim().toLocaleLowerCase());

    // store in variables
    const [displayName, email, ci, areaId, degreeId] = data;

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
      .doc(this.period.id).ref as firestore.DocumentReference<SGMAcademicPeriod.readDTO>;
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

  async readFile(csv: string): Promise<void> {

    const data = csv
      .split(/\r\n|\n/)
      .filter(line => line.trim() !== '')
      .splice(1)
      .map(line => line.split(/,|;/g))
      .map(v => this.transformer(v));

    this.data = await Promise.all(data);
  } catch(error: Error) {
    alert(error.message);
    this.data = [];
  }
}
