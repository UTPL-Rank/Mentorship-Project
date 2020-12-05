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
import { GenerateCSVFromObjects } from '../utils/utils';

export const CSVMentors2 = functions.https.onCall(async (data, context) => {
    const mentors = await ListMentorsCurrentPeriod();
    const headers = ['Index', 'Nombre del Mentor'];

    const callback: IExportCallback<Mentor> = (mentor, i, arr) => {
        return [
            `Nro. ${i + 1} de ${arr.length}`,
            mentor.displayName,
        ];
    }

    const exporter = new CSVFormat<Mentor>(headers, mentors);

    return exporter.export(callback);
});

export const CSVMentors = functions.https.onCall(async (data, context) => {
    const mentors = await ListMentorsCurrentPeriod();

    const columnsNames = ['Nombre Mentor', 'Cedula de Identidad', 'Correo Electrónico', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Estudiantes Asignados'];
    const columnKeys = ['displayName', 'ci', 'email', 'area.name', 'degree.name', 'stats.accompanimentsCount', 'stats.assignedStudentCount'];

    const csv = GenerateCSVFromObjects(mentors, columnKeys, columnsNames, ',');

    return csv;
});
