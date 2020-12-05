/**
 * CSV Mentors
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name CSVMentors callable¶ function name
 * 
 * Firebase callable function to generate the data to export mentors
 * in a CSV format.
 * 
 * Return the generated CSV content
 */

import * as functions from 'firebase-functions';
import { CSVFormat } from '../shared/export/csv-format';
import { IExportCallback } from '../shared/export/i-export-callback';
import { ListMentorsCurrentPeriod, Mentor } from '../utils/mentors-utils';

export const CSVMentors = functions.https.onCall(async (data, context) => {
    const mentors = await ListMentorsCurrentPeriod();
    const headers = ['Index', 'Nombre del Mentor', 'Correo Electrónico', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Estudiantes Asignados'];

    const callback: IExportCallback<Mentor> = (mentor, i, arr) => {
        return [
            `Nro. ${i + 1} de ${arr.length}`,
            mentor.displayName,
            mentor.email,
            mentor.area.name,
            mentor.degree.name,
            mentor.stats.accompanimentsCount,
            mentor.stats.assignedStudentCount,
        ];
    }

    const exporter = new CSVFormat<Mentor>(headers, mentors);

    return exporter.export(callback);
});