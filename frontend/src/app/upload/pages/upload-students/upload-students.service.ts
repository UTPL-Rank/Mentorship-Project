import { Injectable } from '@angular/core';
import { SGMStudent } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { StudentClaims } from 'src/app/models/user-claims';
import { IBaseUploadDataService } from '../../services/i-base-upload-data.service';

@Injectable({ providedIn: 'root' })
export class UploadStudentsService extends IBaseUploadDataService<SGMStudent.createDTO>{

  protected async uploadBatch(data: SGMStudent.createDTO[]): Promise<void> {

    const batch = this.db.firestore.batch();

    data.forEach(student => {

      const username = student.email.split('@')[0];
      const studentRef = this.db.collection('students').doc(student.id).ref;
      const mentorRef = student.mentor.reference;
      const claimsRef = this.usersService.claimsDocument(username).ref;

      // data to be saved
      const claims: StudentClaims = { isStudent: true, mentorId: mentorRef.id, studentId: studentRef.id };

      // transactions
      batch.set(studentRef, student, { merge: true });
      batch.set(claimsRef, claims, { merge: true });

      const updateMentor = {
        'stats.assignedStudentCount': firestore.FieldValue.increment(1),
        'students.withAccompaniments': [],
        'students.withoutAccompaniments': firestore.FieldValue.arrayUnion(student.displayName),
        'students.cycles': firestore.FieldValue.arrayUnion(student.cycle),
        'students.degrees': firestore.FieldValue.arrayUnion(student.degree.name)
      };

      batch.update(mentorRef, updateMentor);

      // batch.update(mentorRef, 'stats.assignedStudentCount', firestore.FieldValue.increment(1));
      // batch.update(mentorRef, 'students.withAccompaniments', []);
      // batch.update(mentorRef, 'students.withoutAccompaniments', firestore.FieldValue.arrayUnion(student.displayName));
      // batch.update(mentorRef, 'students.cycles', firestore.FieldValue.arrayUnion(student.cycle));
      // batch.update(mentorRef, 'students.degrees', firestore.FieldValue.arrayUnion(student.degree.name));

    });

    // batch writes
    await batch.commit();
  }
}
