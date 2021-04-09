import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class IBaseCsvTransformerService<T> {

  constructor(
    protected readonly db: AngularFirestore,
  ) { }

  public transform$(csv: Array<Array<string>>): Observable<Array<T>> {

    const csvToObjects = csv.map(async row => await this.transformRowToObject(row))

    return from(Promise.all(csvToObjects));
  }

  protected abstract transformRowToObject(row: Array<string>): Promise<T>;

}
