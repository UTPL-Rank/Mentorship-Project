import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { SGMFunctionsCsvAccompaniments } from '@utpl-rank/sgm-helpers';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SaveFileService } from '../../core/modules/save-file/save-file.service';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';
import { IExport } from '../../shared/interfaces/i-export';

@Injectable({ providedIn: 'root' })
export class ExportAccompanimentsCSVService implements IExport<SGMFunctionsCsvAccompaniments.requestDTO> {

  constructor(
    private readonly logger: BrowserLoggerService,
    private readonly saveFile: SaveFileService,
    private readonly functions: AngularFireFunctions,
  ) { }

  export$(options: SGMFunctionsCsvAccompaniments.requestDTO): Observable<boolean> {
    const csvMentors = this.functions.httpsCallable<SGMFunctionsCsvAccompaniments.requestDTO, SGMFunctionsCsvAccompaniments.responseDTO>('CSVAccompaniments');

    const saveTask = csvMentors(options).pipe(
      mergeMap(async payload => await this.saveFile.save('acompañamientos - sgm.csv', payload)),
      map(() => true),
      catchError(err => {
        this.logger.error('Error exporting accompaniments', err);
        return of(false);
      })
    );

    return saveTask;
  }
}
