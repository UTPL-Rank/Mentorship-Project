import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { BrowserLoggerService } from 'src/app/core/services/browser-logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export abstract class IBaseUploadDataService<T> {

  constructor(
    protected readonly db: AngularFirestore,
    protected readonly logger: BrowserLoggerService,
    protected readonly usersService: UserService, // delete this
  ) { }

  public upload$(data: Array<T>): Observable<boolean> {
    return from(this.uploadBatch(data)).pipe(
      mapTo(true),
      catchError(err => {
        this.logger.error(err);
        return of(false);
      })
    );
  }

  protected abstract uploadBatch(data: Array<T>): Promise<void>;

}
