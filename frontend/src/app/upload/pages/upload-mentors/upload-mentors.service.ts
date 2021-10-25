import { Injectable } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { IBaseUploadDataService } from '../../services/i-base-upload-data.service';
import { MentorClaims } from '../../../models/user-claims';

@Injectable({ providedIn: 'root' })
export class UploadMentorsService extends IBaseUploadDataService<SGMMentor.createDTO>{

  protected async uploadBatch(data: SGMMentor.createDTO[]): Promise<void> {
    const batch = this.db.firestore.batch();

    data.forEach(mentor => {
      // references to all the documents that will be updated when a new mentor is created
      const mentorRef = this.db.collection('mentors').doc(mentor.id).ref;

      const username = mentor.email.split('@')[0];
      const claimsRef = this.usersService.claimsDocument(username).ref;

      // mentor claims
      const claims: MentorClaims = { isMentor: true, mentorId: mentorRef.id };

      // transactions
      batch.set(mentorRef, mentor);
      batch.set(claimsRef, claims, { merge: true });
    });

    // batch writes
    await batch.commit();
  }

}
