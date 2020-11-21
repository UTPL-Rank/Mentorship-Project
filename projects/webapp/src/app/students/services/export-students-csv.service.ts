import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CSVGeneratorService } from '../../core/modules/export-formats/csv-generator.service';
import { SaveFileService } from '../../core/modules/save-file/save-file.service';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';
import { Student } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class ExportStudentsCSVService {
    constructor(
        private readonly csv: CSVGeneratorService,
        private readonly logger: BrowserLoggerService,
        private readonly saveFile: SaveFileService,
    ) { }

    export$(students: Student[]): Observable<boolean> {
        const columnsNames = [
            'Nombre Estudiante',
            'Nombre Mentor',
            'Correo Electrónico',
            'Área Académica',
            'Titulación',
            'Acompañamientos Realizados',
        ];

        const columnsKeys = [
            'displayName',
            'mentor.displayName',
            'email',
            'area.name',
            'degree.name',
            'stats.accompanimentsCount',
        ];

        const payload = this.csv.generate({ columnsKeys, columnsNames, objects: students });

        const saveTask = from(this.saveFile.save('estudiantes.csv', payload)).pipe(
            map(() => true),
            catchError(err => {
                this.logger.error('Error exporting students', err);
                return of(false);
            })
        );
        return saveTask;
    }
}
