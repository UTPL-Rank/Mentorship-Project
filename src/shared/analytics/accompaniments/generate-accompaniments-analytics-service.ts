import { SGMAcademicPeriod, SGMAccompaniment, SGMAnalytics } from "@utpl-rank/sgm-helpers";

/**
 * Turn a complete accompaniment into an analytics entry and remove un-used values in the process
 * @param accompaniment data to be transformed
 */
function TransformAccompanimentToAnEntry(accompaniment: SGMAccompaniment.readDTO): SGMAnalytics.AccompanimentEntry {
    const newAcc: SGMAnalytics.AccompanimentEntry = {
        kind: accompaniment.kind || null,
        area: { name: accompaniment.area.name, id: accompaniment.area.reference.id },
        period: { name: accompaniment.period.name, id: accompaniment.period.reference.id },
        degree: { name: accompaniment.degree.name, id: accompaniment.degree.reference.id },
        mentor: { displayName: accompaniment.mentor.displayName, id: accompaniment.mentor.reference.id, },
        student: { displayName: accompaniment.student.displayName, id: accompaniment.student.reference.id, },
        followingKind: accompaniment.followingKind,
        important: !!accompaniment.important,
        id: accompaniment.id,
        problems: accompaniment.problems,
        reviewed: !accompaniment.reviewKey,
        semesterKind: accompaniment.semesterKind,
    };

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
export function GenerateAccompanimentsAnalyticsService(period: SGMAcademicPeriod.readDTO, accompaniments: Array<SGMAccompaniment.readDTO>): SGMAnalytics.AccompanimentsAnalytics {

    const id = GenerateAnalyticsIdentifier(period);

    const analyticsAccompaniments: Array<SGMAnalytics.AccompanimentEntry> = accompaniments.map(TransformAccompanimentToAnEntry);

    const response: SGMAnalytics.AccompanimentsAnalytics = {
        id,
        accompaniments: analyticsAccompaniments,
        lastUpdated: Date.now(),
        period: { id: period.id, name: period.name },
    };

    return response;
}
