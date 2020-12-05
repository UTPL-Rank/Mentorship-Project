import * as functions from 'firebase-functions';
import { CSVFormat } from '../shared/export/csv-format';
import { IExportCallback } from '../shared/export/i-export-callback';
import { ListStudentsCurrentPeriod, Student } from '../utils/student-utils';

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
    const students = await ListStudentsCurrentPeriod();
    const headers = ['Index', 'Nombre Estudiante', 'Correo Electrónico', 'Nombre Mentor', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Cyclo'];

    const callback: IExportCallback<Student> = (student, i, arr) => {
        return [
            `Nro. ${i + 1} de ${arr.length}`,
            student.displayName,
            student.email,
            student.mentor.displayName,
            student.area.name,
            student.degree.name,
            student.stats.accompanimentsCount,
            student.cycle,
        ];
    }

    const exporter = new CSVFormat<Student>(headers, students);

    return exporter.export(callback);
});
