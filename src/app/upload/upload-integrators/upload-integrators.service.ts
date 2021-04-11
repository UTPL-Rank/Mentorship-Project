import { Injectable } from '@angular/core';
import { SGMIntegrator } from '@utpl-rank/sgm-helpers';
import { IBaseUploadDataService } from '../services/i-base-upload-data.service';

@Injectable({ providedIn: 'root' })
export class UploadIntegratorsService extends IBaseUploadDataService<SGMIntegrator.createDTO>{

  protected async uploadBatch(data: SGMIntegrator.createDTO[]): Promise<void> {
    const batch = this.db.firestore.batch();

    data.forEach(integrator => {
      // references to all the documents that will be updated when a new mentor is created
      const integratorRef = this.db.collection('integrators').doc(integrator.id).ref;
      batch.set(integratorRef, integrator);
    });

    // batch writes
    await batch.commit();
  }

}
