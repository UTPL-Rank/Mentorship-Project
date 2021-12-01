import { SGMFunctionsCsvAccompaniments, SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { CSVFormat } from '../shared/export/csv-format';
import { IExportCallback } from '../shared/export/i-export-callback';
import { RemoveJumpLines } from '../shared/utils/remove-jump-lines';
import { ListAccompanimentsPeriod } from '../utils/accompaniments-utils';

/**
 * CSV Accompaniments
 * ==========================================================
 *
 * @author Bruno Esparza
 *
 * Generate a [CSV] document with the all accompaniments of an academic period.
 *
 * @return generated content to be downloaded
 */
const _CSVAccompaniments = async (data: SGMFunctionsCsvAccompaniments.requestDTO, _: CallableContext): Promise<SGMFunctionsCsvAccompaniments.responseDTO> => {
    const { periodId } = data;

    const accompaniments = await ListAccompanimentsPeriod(periodId);

    const header = [
        'Indice',
        'Tipo de Acompañamiento',
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
        'Problemas Conectividad',
        'Otros Problemas',
        'Ningún Problema',
        'Subgrupo de Problema',
        'Problemática',
        'Descripción del problema',
        'Solución del problema',
        'Temática Libre',
        'Descripción de la Temática',
    ];

    const callback: IExportCallback<SGMAccompaniment.readDTO> = (accompaniment, i, arr) => {
        return [
            `Nro. ${i + 1} de ${arr.length}`,
            SGMAccompaniment.translateKind(accompaniment.kind),
            accompaniment.timeCreated.toDate().toDateString(),
            accompaniment.student.displayName.toUpperCase(),
            accompaniment.mentor.displayName.toUpperCase(),
            accompaniment.area.name.toUpperCase(),
            accompaniment.degree.name.toUpperCase(),
            accompaniment.important ? 'IMPORTANTE' : '',
            SGMAccompaniment.translateFollowing(accompaniment.followingKind),
            accompaniment.problems.academic ? 'Académicos' : '',
            accompaniment.problems.administrative ? 'Administrativos' : '',
            accompaniment.problems.economic ? 'Económicos' : '',
            accompaniment.problems.psychosocial ? 'Psicosocial' : '',
            accompaniment.problems.connectivity ? 'Conectividad' : '',
            accompaniment.problems.other ? 'Otro Problema' : '',
            accompaniment.problems.none ? 'Ningún Problema' : '',
            RemoveJumpLines(accompaniment.subproblem ?? ''),
            RemoveJumpLines(accompaniment.problematic ?? ''),
            RemoveJumpLines(accompaniment.problemDescription ?? ''),
            RemoveJumpLines(accompaniment.solutionDescription ?? ''),
            RemoveJumpLines(accompaniment.problems.otherDescription ?? ''),
            RemoveJumpLines(accompaniment.topicDescription ?? ''),
        ];
    }

    const exporter = new CSVFormat<SGMAccompaniment.readDTO>(header, accompaniments);

    return exporter.export(callback);
};

export const CSVAccompaniments = functions
    .runWith({ maxInstances: 1 })
    .https
    .onCall(_CSVAccompaniments);
