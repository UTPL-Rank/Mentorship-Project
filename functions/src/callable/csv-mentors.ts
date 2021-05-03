import { SGMFunctionsCsvMentors, SGMMentor } from '@utpl-rank/sgm-helpers';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { CSVFormat } from '../shared/export/csv-format';
import { IExportCallback } from '../shared/export/i-export-callback';
import { ListMentorsPeriod } from '../utils/mentors-utils';

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
const _CSVMentors = async (data: SGMFunctionsCsvMentors.requestDTO, _: CallableContext): Promise<SGMFunctionsCsvMentors.responseDTO> => {
    const { periodId } = data;

    const mentors = await ListMentorsPeriod(periodId);
    const headers = ['Index', 'Nombre del Mentor', 'Correo Electrónico', 'Primer año Mentor', 'Continua semestre', 'Ultimo Acompañamiento', 'Área Académica', 'Titulación', 'Acompañamientos Realizados', 'Estudiantes Asignados'];

    const callback: IExportCallback<SGMMentor.readDTO> = async (mentor, i, arr) => {

        return [
            `Nro. ${i + 1} de ${arr.length}`,
            mentor.displayName,
            mentor.email,
            mentor.firstYear ? 'Si' : 'No',
            mentor.continues ? 'Si' : 'No',
            mentor.stats.lastAccompaniment?.toDate().toISOString().substring(0, 10) ?? 'Sin acompañamientos',
            mentor.area.name,
            mentor.degree.name,
            mentor.stats.accompanimentsCount,
            mentor.stats.assignedStudentCount,
        ];
    }

    const exporter = new CSVFormat<SGMMentor.readDTO>(headers, mentors);

    return exporter.export(callback);
};

export const CSVMentors = functions.https.onCall(_CSVMentors);