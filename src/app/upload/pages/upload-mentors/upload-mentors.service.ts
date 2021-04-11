import { Injectable } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { IBaseUploadDataService } from '../../services/i-base-upload-data.service';

@Injectable({ providedIn: 'root' })
export class UploadMentorsService extends IBaseUploadDataService<SGMMentor.createDTO>{

  protected async uploadBatch(data: SGMMentor.createDTO[]): Promise<void> {
    const batch = this.db.firestore.batch();

    data.forEach(mentor => {
      // references to all the documents that will be updated when a new mentor is created
      const mentorRef = this.db.collection('mentors').doc(mentor.id).ref;
      batch.set(mentorRef, mentor);
    });

    // batch writes
    await batch.commit();
  }

}
