import { SGMAcademicPeriod, SGMAccompaniment, SGMAnalytics, SGMStudent } from "@utpl-rank/sgm-helpers";

const studentsMap: Record<string, SGMStudent.readDTO> = {};

/**
 * Turn a complete accompaniment into an analytics entry and remove un-used values in the process
 * @param accompaniment data to be transformed
 */
async function TransformAccompanimentToAnEntry(accompaniment: SGMAccompaniment.readDTO): Promise<SGMAnalytics.AccompanimentEntry> {
    const studentId = accompaniment.student.reference.id;

    let student: SGMStudent.readDTO | null = studentsMap[studentId] ?? null;

    if (!student) {
        const studentSnap = await accompaniment.student.reference.get();
        student = (studentSnap.data() as SGMStudent.readDTO) ?? null;

        if (!student)
            throw new Error(`Student with id ${studentId} not found`)

        studentsMap[studentId] = student;
    }

    const newAcc: SGMAnalytics.AccompanimentEntry = {
        kind: accompaniment.kind || null,
        area: { name: accompaniment.area.name, id: accompaniment.area.reference.id },
        period: { name: accompaniment.period.name, id: accompaniment.period.reference.id },
        degree: { name: accompaniment.degree.name, id: accompaniment.degree.reference.id },
        mentor: { displayName: accompaniment.mentor.displayName, id: accompaniment.mentor.reference.id, },
        student: { displayName: accompaniment.student.displayName, id: accompaniment.student.reference.id, cycle: student.cycle },
        followingKind: accompaniment.followingKind,
        important: !!accompaniment.important,
        id: accompaniment.id,
        problems: accompaniment.problems,
        reviewed: !accompaniment.reviewKey,
        semesterKind: accompaniment.semesterKind,
    } as any; // TODO: remove any

    return newAcc;
}

/**
 * Generate an unique identifier to store the analytics report 
 * @param periodData academic witch correspond to the analytics being generated
 */
function GenerateAnalyticsIdentifier(periodData: SGMAcademicPeriod.readDTO): string {
    return `${periodData.id}-accompaniments`;
}

/**
 * ## Generate Accompaniments Analytics Service
 * 
 * @author Bruno Esparza
 * 
 * Service to generate an analytics report of accompaniments
 * @param period period where the data comes from
 * @param accompaniments list ob accompaniments to be transformed into an analytics report
 */
export async function GenerateAccompanimentsAnalyticsService(period: SGMAcademicPeriod.readDTO, accompaniments: Array<SGMAccompaniment.readDTO>): Promise<SGMAnalytics.AccompanimentsAnalytics> {

    const id = GenerateAnalyticsIdentifier(period);

    const analyticsAccompaniments: Array<SGMAnalytics.AccompanimentEntry> = await Promise.all(accompaniments.map(TransformAccompanimentToAnEntry));

    const response: SGMAnalytics.AccompanimentsAnalytics = {
        id,
        accompaniments: analyticsAccompaniments,
        lastUpdated: Date.now(),
        period: { id: period.id, name: period.name },
    };

    return response;
}
