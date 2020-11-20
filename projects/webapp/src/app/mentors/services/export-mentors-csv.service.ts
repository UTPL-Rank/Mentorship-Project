import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CSVGeneratorService } from '../../core/modules/export-formats/csv-generator.service';
import { SaveFileService } from '../../core/modules/save-file/save-file.service';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';
import { Mentor } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class ExportMentorsCSVService {
    constructor(
        private readonly csv: CSVGeneratorService,
        private readonly logger: BrowserLoggerService,
        private readonly saveFile: SaveFileService,
    ) { }

    export(mentors: Mentor[]): Observable<boolean> {

        const columnsNames = [
            'Nombre Mentor',
            'Cedula de Identidad',
            'Correo Electrónico',
            'Área Académica',
            'Titulación',
            'Acompañamientos Realizados',
            'Estudiantes Asignados',
        ];

        const columnsKeys = [
            'displayName',
            'ci',
            'email',
            'area.name',
            'degree.name',
            'stats.accompanimentsCount',
            'stats.assignedStudentCount',
        ];

        const payload = this.csv.generate({ columnsKeys, columnsNames, objects: mentors });

        const saveTask = from(this.saveFile.save('mentores.csv', payload)).pipe(
            map(() => true),
            catchError(err => {
                this.logger.error('Error exporting mentors', err);
                return of(false);
            })
        );
        return saveTask;
    }
}
