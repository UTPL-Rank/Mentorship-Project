import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CSVGeneratorService } from '../../core/modules/export-formats/csv-generator.service';
import { SaveFileService } from '../../core/modules/save-file/save-file.service';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';
import { Accompaniment } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class ExportAccompanimentsCSVService {
    constructor(
        private readonly csv: CSVGeneratorService,
        private readonly logger: BrowserLoggerService,
        private readonly saveFile: SaveFileService,
    ) { }

    export$(accompaniments: Accompaniment[]): Observable<boolean> {
        const columnsNames = [
            'Nombre Estudiante',
            'Nombre Mentor',
            'Seguimiento',
            'Problemas Académicos',
            'Problemas Administrativos',
            'Problemas Económicos',
            'Problema Psicosocial',
            'Ningún Problema',
            'Otro',
            'Temas Desarrollados',
            'Descripción del Problema',
            'Solución del Problema',
            'Importante',
        ];

        const columnsKeys = [
            'mentor.displayName',
            'student.displayName',
            'followingKind',
            'problems.academic',
            'problems.administrative',
            'problems.economic',
            'problems.psychosocial',
            'problems.otherDescription',
            'problems.other',
            'topicDescription',
            'problemDescription',
            'solutionDescription',
            'important',
        ];

        const payload = this.csv.generate({ columnsKeys, columnsNames, objects: accompaniments });

        const saveTask = from(this.saveFile.save('acompañamientos.csv', payload)).pipe(
            map(() => true),
            catchError(err => {
                this.logger.error('Error exporting accompaniments', err);
                return of(false);
            })
        );
        return saveTask;
    }
}
