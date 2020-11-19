import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { Accompaniment, AccompanimentAsset, CreateFirestoreAccompaniment, FollowingKind, SemesterKind } from '../../../models/models';


export interface AccompanimentFormValue {
    studentId: string;

    semesterKind: string;
    followingKind: string;
    problemDescription: string;
    solutionDescription: string;
    topicDescription: string;
    important: boolean;

    problems: {
        none: boolean;
        academic: boolean;
        administrative: boolean;
        economic: boolean;
        psychosocial: boolean;
        other: boolean;
        otherDescription: string;
        problemCount: number;
    };

    assets: File[];
}

@Injectable({ providedIn: 'root' })
export class SaveAccompanimentService {
    constructor(
        private readonly firestoreDB: AngularFirestore,
        private readonly accompanimentsService: AccompanimentsService,
        private readonly mentorsService: MentorsService,
        private readonly studentsService: StudentsService,
        private readonly storage: AngularFireStorage,
        private readonly logger: BrowserLoggerService,
    ) { }

    public save(mentorId: string, value: any, files: File[]): Observable<Accompaniment | null> {
        let problemCount = 0;
        if (!!value.problems.academic)
            problemCount++;
        if (!!value.problems.administrative)
            problemCount++;
        if (!!value.problems.economic)
            problemCount++;
        if (!!value.problems.otherDescription)
            problemCount++;
        if (!!value.problems.psychosocial)
            problemCount++;
        if (!!value.problems.none) {
            problemCount = 0;
            value.problems.academic = false;
            value.problems.administrative = false;
            value.problems.economic = false;
            value.problems.psychosocial = false;
            value.important = false;
            value.problems.otherDescription = '';
        }

        const accompaniment = ({
            assets: files,
            followingKind: value.followingKind,
            problems: {
                none: value.problems.none,
                academic: value.problems.academic,
                administrative: value.problems.administrative,
                economic: value.problems.economic,
                otherDescription: !!value.problems.otherDescription
                    ? (value.problems.otherDescription as string).trim()
                    : null,
                psychosocial: value.problems.psychosocial,
                other: !!value.problems.otherDescription,
                problemCount
            },
            important: value.important ?? false,
            problemDescription: (value.problemDescription ?? 'Sin problemas' as string).trim(),
            semesterKind: value.semesterKind,
            solutionDescription: (value.solutionDescription ?? 'Sin problemas' as string).trim(),
            topicDescription: (value.topicDescription ?? 'Sin problemas' as string).trim(),
            studentId: value.studentId
        });

        const saveTask = this.saveAccompanimentInDb(mentorId, accompaniment);
        return saveTask;
    }

    /**
     * Create and register a new accompaniment in the platform
     *
     * @param mentorId identifier of the mentor of the student
     * @param data payload data from the form
     */
    private saveAccompanimentInDb(mentorId: string, data: AccompanimentFormValue): Observable<Accompaniment | null> {
        const accompanimentCreateSource = from(this.createAccompanimentFromForm(mentorId, data));

        const createAccompanimentTask = accompanimentCreateSource.pipe(
            mergeMap(async acc => {
                const batch = this.firestoreDB.firestore.batch();

                const mentorReference = this.mentorsService.mentorRef(mentorId);
                const studentReference = this.studentsService.studentRef(data.studentId);
                const accompanimentRef = this.accompanimentsService.accompanimentRef(acc.id);
                console.log(acc);


                batch.set(accompanimentRef, acc);
                batch.update(mentorReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
                batch.update(mentorReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());
                batch.update(mentorReference, 'students.withAccompaniments', firestore.FieldValue.arrayUnion(acc.student.displayName));
                batch.update(mentorReference, 'students.withoutAccompaniments', firestore.FieldValue.arrayRemove(acc.student.displayName));
                batch.update(studentReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
                batch.update(studentReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());

                await batch.commit();
                return acc;
            }),
            catchError((err) => {
                this.logger.error('Error saving accompaniment', err);
                return of(null);
            })
        );

        return createAccompanimentTask;
    }

    private async createAccompanimentFromForm(mentorId: string, data: AccompanimentFormValue): Promise<CreateFirestoreAccompaniment> {
        const mentorReference = this.mentorsService.mentorRef(mentorId);
        const mentorSnap = await mentorReference.get();
        const mentorData = mentorSnap.data();

        const studentReference = this.studentsService.studentRef(data.studentId);
        const studentSnap = await studentReference.get();
        const studentData = studentSnap.data();

        const accompaniment: CreateFirestoreAccompaniment = {
            id: this.firestoreDB.createId(),
            mentor: { ...mentorData, reference: mentorReference, },
            student: { ...studentData, reference: studentReference, },
            period: studentData.period,
            degree: studentData.degree,
            area: studentData.area,

            timeCreated: firestore.FieldValue.serverTimestamp(),
            assets: await this.uploadAccompanimentAssets(data.assets),

            // accompaniment data
            important: data.important,
            followingKind: data.followingKind as FollowingKind,
            semesterKind: data.semesterKind as SemesterKind,
            problemDescription: data.problemDescription,
            problems: data.problems,
            reviewKey: Math.random().toString(36).substring(7),
            solutionDescription: data.solutionDescription,
            topicDescription: data.topicDescription
        };

        return accompaniment;
    }

    /**
     * Upload assets to the cloud storage, save them in the accompaniments folder with the
     * current date.
     *
     * This method does not implement any catch error fallback, if a file can't be uploaded
     * them the hole process of saving should be aborted.
     *
     * @param files that need to be uploaded to the platform
     */
    private async uploadAccompanimentAssets(files: File[]): Promise<Array<AccompanimentAsset>> {
        const folderName = Date.now();

        // for each file, create a reference to the file being uploaded
        const paths = await Promise.all(
            files.map(
                async file => {
                    const path = `/accompaniments/assets/${folderName}/${file.name}`;
                    await this.storage.upload(path, file);
                    return path;
                }
            )
        );

        // obtain the url of the files uploaded and the reference to the file
        const assetsData = paths.map(async path => {
            const ref = this.storage.storage.ref(path);
            const data: AccompanimentAsset = {
                name: ref.name,
                path,
                downloadUrl: await ref.getDownloadURL(),
            };

            return data;
        });

        return await Promise.all(assetsData);
    }
}
