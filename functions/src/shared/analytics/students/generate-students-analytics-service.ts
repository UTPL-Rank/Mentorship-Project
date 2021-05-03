import { SGMAcademicPeriod, SGMAnalytics, SGMStudent } from "@utpl-rank/sgm-helpers";
import { UndefinedCleaner } from "../../utils/undefined-cleaner";

/**
 * Turn a complete student into an analytics entry and remove un-used values in the process
 * @param student data to be transformed
 */
function TransformStudentToAnEntry(student: SGMStudent.readDTO): SGMAnalytics.StudentEntry {
    const newStudent: SGMAnalytics.StudentEntry = {
        area: {
            name: student.area.name,
            id: student.area.reference.id
        },
        period: {
            name: student.period.name,
            id: student.period.reference.id
        },
        degree: {
            name: student.degree.name,
            id: student.degree.reference.id
        },
        mentor: {
            displayName: student.mentor.displayName,
            id: student.mentor.reference.id,
        },
        id: student.id,
        accompanimentsCount: student.stats.accompanimentsCount,
        cycle: student.cycle,
        displayName: student.displayName,
        continues: !!student.continues,
    };

    return UndefinedCleaner(newStudent);
}

/**
 * Generate an unique identifier to store the analytics report 
 * @param periodData academic witch correspond to the analytics being generated
 */
function GenerateAnalyticsIdentifier(periodData: SGMAcademicPeriod.readDTO): string {
    return `${periodData.id}-students`;
}

/**
 * ## Generate Students Analytics Service
 * 
 * @author Bruno Esparza
 * 
 * Service to generate an analytics report of students
 * @param period period where the data comes from
 * @param students list ob students to be transformed into an analytics report
 */
export function GenerateStudentsAnalyticsService(period: SGMAcademicPeriod.readDTO, students: Array<SGMStudent.readDTO>): SGMAnalytics.StudentsAnalytics {

    const id = GenerateAnalyticsIdentifier(period);

    const analyticsStudents: Array<SGMAnalytics.StudentEntry> = students.map(TransformStudentToAnEntry);

    const response: SGMAnalytics.StudentsAnalytics = {
        id,
        students: analyticsStudents,
        lastUpdated: Date.now(),
        period: { id: period.id, name: period.name },
    };

    return response;
}
