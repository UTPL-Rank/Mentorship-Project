import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AcademicAreaReference, FirestoreAcademicDegree, FirestoreAcademicDegrees, UploadData } from 'projects/webapp/src/app/models/models';

@Component({
  selector: 'sgm-upload-degrees',
  templateUrl: './upload-degrees.component.html'
})
export class UploadDegreesComponent implements UploadData<FirestoreAcademicDegree> {
  constructor(private db: AngularFirestore, private router: Router) { }

  isSaving = false;

  data: FirestoreAcademicDegrees;

  async save(): Promise<void> {
    if (!this.data) {
      alert('Primero lee el archivo de los carreras académicas.');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const batch = this.db.firestore.batch();

      this.data.forEach(area => {
        const { ref } = this.db.collection('academic-degrees').doc(area.id);
        batch.set(ref, area);
      });

      await batch.commit();
      alert('Todos las carreras han sido guardados.');
      // this.router.navigateByUrl('/');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar las carreras, vuelve a intentarlo.');
    }
  }

  async transformer(rawData: string[]): Promise<FirestoreAcademicDegree> {
    const data = rawData.map(d => d.toLocaleLowerCase().trim());
    const [areaId, id, name] = data;

    // Obtain area data
    const areaReference = this.db.collection('academic-areas').doc(areaId).ref as AcademicAreaReference;
    const areaSnap = await areaReference.get();
    if (!areaSnap.exists) throw new Error(`El área ${areaSnap.id} no existe.`);
    const areaData = areaSnap.data();

    return {
      id,
      name,
      area: {
        reference: areaReference,
        name: areaData.name
      }
    };
  }

  async readFile(csv: string): Promise<void> {

    const data = csv
      .split(/\r\n|\n/)
      .filter(line => line.trim() !== '')
      .splice(1)
      .map(line => line.split(';'))
      .map(v => this.transformer(v));


    this.data = await Promise.all(data);
  } catch(error) {
    alert(error.message);
    this.data = [];
  }
}
