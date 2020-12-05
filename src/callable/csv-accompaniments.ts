import * as functions from 'firebase-functions';
import { CSVFormat } from '../shared/export/csv-format';
import { IExportCallback } from '../shared/export/i-export-callback';
import { Accompaniment, ListAccompanimentsCurrentPeriod } from '../utils/accompaniments-utils';

/**
 * CSV Accompaniments
 * ==========================================================
 *
 * @author Bruno Esparza
 *
 * @name CSVAccompaniments callable function name
 *
 * Firebase callable function to generate the data to export the data of accompaniments
 * in a csv format.
 *
 * @return generated csv string
 */
export const CSVAccompaniments = functions.https.onCall(async (data) => {
    const accompaniments = await ListAccompanimentsCurrentPeriod();
    const header = [
        'Indice',
        'Fecha de creación',
        'Nombre Estudiante',
        'Nombre Mentor',
        'Área Académica',
        'Titulación',
        'Importante',
        'Tipo de seguimiento',
        'Problemas Académicos',
        'Problemas Administrativos',
        'Problemas Económicos',
        'Problemas Psicosocial',
        'Ningún Problemas',
        'Descripción del problema',
        'Solución del problema',
        'Temática Libre',
        'Descripción de la Temática',
    ];

    const callback: IExportCallback<Accompaniment> = (accompaniment, i, arr) => {
        return [
            `Nro. ${i + 1} de ${arr.length}`,
            accompaniment.timeCreated.toDate().toDateString(),
            accompaniment.student.displayName,
            accompaniment.mentor.displayName,
            accompaniment.area.name,
            accompaniment.degree.name,
            accompaniment.important ? 'IMPORTANTE' : '',
            accompaniment.followingKind,
            accompaniment.problems.academic ? 'Académicos' : '',
            accompaniment.problems.administrative ? 'Administrativos' : '',
            accompaniment.problems.economic ? 'Económicos' : '',
            accompaniment.problems.psychosocial ? 'Psicosocial' : '',
            accompaniment.problems.none ? 'Ningún Problema' : '',
            accompaniment.problemDescription ?? '',
            accompaniment.solutionDescription ?? '',
            accompaniment.topic ?? '',
            accompaniment.topicDescription ?? '',
        ];
    }

    const exporter = new CSVFormat<Accompaniment>(header, accompaniments);

    return exporter.export(callback);
});
