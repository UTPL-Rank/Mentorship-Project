import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { FirestoreAccompaniment } from '../../../models/models';
import { ReviewFormValue } from '../../components/review-form-card/review-form-card.component';

@Component({
  selector: 'sgm-review-accompaniment',
  templateUrl: './review-accompaniment.page.html'
})
export class ReviewAccompanimentPage implements OnInit, OnDestroy {
  constructor(
    private readonly db: AngularFirestore,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  public accompaniment: FirestoreAccompaniment;
  private sub: Subscription;
  private isSaving = false;

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      ({ accompaniment }) => (this.accompaniment = accompaniment)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async save(confirmation: ReviewFormValue) {
    if (this.isSaving) return;

    // save on db
    try {
      this.isSaving = true;
      // TODO: validate confirmation
      const batch = this.db.firestore.batch();

      const accompanimentRef = this.db.collection('accompaniments').doc(this.accompaniment.id).ref;

      batch.set(
        accompanimentRef,
        { timeConfirmed: firestore.FieldValue.serverTimestamp(), reviewKey: null, confirmation },
        { merge: true }
      );

      await batch.commit();

      alert('Todos los cambios están guardados.\nGracias por colaborar.');
      this.router.navigateByUrl('/');
    } catch (error) {
      console.log(error);
      this.isSaving = false;
      alert('Ocurrió un error al guardar... Vuelve a intentarlo');
    }
  }
}
