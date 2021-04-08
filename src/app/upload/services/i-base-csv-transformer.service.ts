import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class IBaseCsvTransformerService<T> {

  constructor(
    protected readonly db: AngularFirestore,
  ) { }

  public abstract transform$(csv: Array<Array<string>>): Observable<Array<T>>;
}
