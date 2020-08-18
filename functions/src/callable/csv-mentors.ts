/**
 * CSV Mentors
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name CSVMentors callable function name
 * 
 * Firebase callable function to generate the data to export mentors
 * in a CSV format.
 * 
 * Return the generated CSV content
 */

import * as functions from 'firebase-functions';
import { ListMentorsCurrentPeriod } from '../utils/mentors-utils';
import { GenerateCSVFromObjects } from '../utils/utils';

export const CSVMentors = functions.https.onCall(async (data, context) => {
    const mentors = await ListMentorsCurrentPeriod();
    const columnsNames = ['Nombre Mentor', 'Cedula de Identidad', 'Correo Electrónico', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Estudiantes Asignados'];
    const columnKeys = ['displayName', 'ci', 'email', 'area.name', 'degree.name', 'stats.accompanimentsCount', 'stats.assignedStudentCount'];

    const csv = GenerateCSVFromObjects(mentors, columnKeys, columnsNames, ',');

    return csv;
});
