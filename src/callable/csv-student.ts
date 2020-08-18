import * as functions from 'firebase-functions';
import { ListStudentsOfMentor } from '../utils/student-utils';
import { GenerateCSVFromObjects } from '../utils/utils';

/**
 * CSV Mentors
 * ==========================================================
 *
 * @author Bruno Esparza
 *
 * @name CSVStudents callable function name
 *
 * Firebase callable function to generate the data to export the data of a mentor students
 * in a csv format.
 *
 * @param mentorId identifier of the mentor.
 * @return generated csv string
 */
export const CSVStudents = functions.https.onCall(async (data) => {
    const { mentorId } = data;

    const students = await ListStudentsOfMentor(mentorId);
    const columnsNames = ['Nombre Estudiante', 'Correo Electrónico', 'Nombre Mentor', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Cyclo'];
    const columnKeys = ['displayName', 'email', 'mentor.displayName', 'area.name', 'degree.name', 'stats.accompanimentsCount', 'cycle'];

    const csv = GenerateCSVFromObjects(students, columnKeys, columnsNames, ',');

    return csv;
});
