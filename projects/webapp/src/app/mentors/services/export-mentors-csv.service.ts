import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SaveFileService } from '../../core/modules/save-file/save-file.service';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';

@Injectable({ providedIn: 'root' })
export class ExportMentorsCSVService {
  constructor(
    private readonly logger: BrowserLoggerService,
    private readonly saveFile: SaveFileService,
    private readonly functions: AngularFireFunctions,
  ) { }

  export(): Observable<boolean> {
    const csvMentors = this.functions.httpsCallable('CSVMentors2');

    const saveTask = csvMentors({}).pipe(
      mergeMap(async payload => await this.saveFile.save('mentores.csv', payload)),
      map(() => true),
      catchError(err => {
        this.logger.error('Error exporting mentors', err);
        return of(false);
      })
    );
    return saveTask;
  }
}
