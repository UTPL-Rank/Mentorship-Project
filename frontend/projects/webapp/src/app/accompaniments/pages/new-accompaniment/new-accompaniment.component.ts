import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { AccompanimentFormValue } from '../../../dashboard/components/accompaniment-form/accompaniment-form.component';
import { AcademicPeriod, AccompanimentAsset, AccompanimentAssets, CreateFirestoreAccompaniment, FollowingKind, Mentor, MentorReference, SemesterKind, Student, StudentReference } from '../../../models/models';

@Component({
  selector: 'sgm-new-accompaniment',
  templateUrl: './new-accompaniment.component.html'
})
export class NewAccompanimentComponent implements OnInit {
  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) { }

  // TODO: add disabled property for the child
  public isSaving = false;
  public students: Student[];
  public mentor: Mentor;
  public period: AcademicPeriod;
  public selectedStudentId: string;

  ngOnInit() {
    const { students, mentor, activePeriod } = this.route.snapshot.data;
    const { selectedStudentId } = this.route.snapshot.queryParams;

    this.students = students;
    this.mentor = mentor;
    this.period = activePeriod;

    this.selectedStudentId = selectedStudentId;
  }

  private async uploadFiles(files: File[]): Promise<AccompanimentAssets> {
    const now = Date.now();
    const uploadTasks = files.map(async file => {
      const path = `/accompaniments/assets/${now}/${file.name}`;
      await this.storage.upload(path, file);
      return path;
    });
    const paths = await Promise.all(uploadTasks);

    const assetsData = paths.map(async path => {
      const ref = this.storage.storage.ref(path);
      const data: AccompanimentAsset = {
        name: ref.name,
        path,
        downloadUrl: await ref.getDownloadURL(),
      };

      return data;
    });

    return Promise.all(assetsData);
  }

  async save(data: AccompanimentFormValue) {
    if (this.isSaving) return;

    try {
      this.isSaving = true;

      const mentorReference = this.db.collection('mentors').doc<Mentor>(this.mentor.id).ref as MentorReference;
      const mentorSnap = await mentorReference.get();
      const mentorData = mentorSnap.data();

      const studentReference = this.db.collection('students').doc(data.studentId).ref as StudentReference;
      const studentSnap = await studentReference.get();
      const studentData = studentSnap.data();

      const accompaniment: CreateFirestoreAccompaniment = {
        id: this.db.createId(),
        mentor: { ...mentorData, reference: mentorReference, },
        student: { ...studentData, reference: studentReference, },
        period: studentData.period,
        degree: studentData.degree,
        area: studentData.area,

        timeCreated: firestore.FieldValue.serverTimestamp(),
        assets: await this.uploadFiles(data.assets),

        // accompaniment data
        followingKind: data.followingKind as FollowingKind,
        semesterKind: data.semesterKind as SemesterKind,
        problemDescription: data.problemDescription,
        problems: data.problems,
        reviewKey: Math.random().toString(36).substring(7),
        solutionDescription: data.solutionDescription,
        topicDescription: data.topicDescription
      };

      // ---------------------------------
      // save on firestore
      // ---------------------------------
      const accompanimentRef = this.db.collection('accompaniments').doc(accompaniment.id).ref;
      const batch = this.db.firestore.batch();

      batch.set(accompanimentRef, accompaniment);
      // TODO: change to one reference
      batch.update(mentorReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
      batch.update(mentorReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());
      batch.update(studentReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
      batch.update(studentReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());

      await batch.commit();
      alert('Todos los cambios están guardados');
      await this.router.navigate([
        'panel-control',
        accompaniment.period.reference.id,
        'ver-acompañamiento',
        accompaniment.mentor.reference.id,
        accompaniment.id
      ]);
    } catch (error) {
      console.log(error);

      this.isSaving = false;
    }
  }
}
