import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { firestore } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { SGMProblem } from '../../models/problem.model';

const PROBLEMS_COLLECTION_NAME = 'problems';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance
  ) { }

  /**
   * Get the firestore collection of problems
   */
  public getProblemsCollection(): AngularFirestoreCollection<SGMProblem> {
    return this.angularFirestore
      .collection<SGMProblem>(PROBLEMS_COLLECTION_NAME);
  }

  /**
   * Get the firestore document of a problem
   * @param problemId Identifier of the problem
   */
  private problemDocument(problemId: string): AngularFirestoreDocument<SGMProblem> {
    return this.angularFirestore
      .collection(PROBLEMS_COLLECTION_NAME)
      .doc<SGMProblem>(problemId);
  }

  public problem(problemId: string): Observable<SGMProblem> {
    return this.problemDocument(problemId).get().pipe(
      map(snap => (snap.data() as SGMProblem))
    );
  }

  public problemRef(problemId: string): firestore.DocumentReference<SGMProblem> {
    return this.problemDocument(problemId).ref as firestore.DocumentReference<SGMProblem>;
  }

  /**
   * Get an observable of the problem and share the response
   * @param problemId Identifier of the problem
   */
  public problemStream(problemId: string): Observable<SGMProblem> {
    return this.problemDocument(problemId).valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('stream-problem');
          return doc as any;
        }),
        shareReplay(1)
      );
  }

}
