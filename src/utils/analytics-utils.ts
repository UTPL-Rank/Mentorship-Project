import { firestore } from "firebase-admin";
import { ListAccompanimentsPeriod } from "./accompaniments-utils";
import { GetMentorDetailsEvaluation, ListMentorsPeriod } from "./mentors-utils";
import { CurrentPeriod } from "./period-utils";
import { ListStudentsPeriod } from "./student-utils";
import { dbFirestore } from "./utils";

/**
 * Analytics Collection
 * =======================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore collection of analytics
 */
function AnalyticsCollection(): firestore.CollectionReference {
    return dbFirestore.collection('analytics');
}

/**
 * Analytics Document
 * ========================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of an analytic 
 * 
 * @param id name of the analytic document
 */
function AnalyticsDocument<T>(id: string): firestore.DocumentReference<T> {
    return AnalyticsCollection().doc(id) as firestore.DocumentReference<T>;
}

/**
 * Update Analytics Document
 * =====================================================
 * 
 * @author Bruno Esparza
 * 
 * Update the information of an academic document. 
 * All the information already stored in the document will be overwritten  
 * 
 * @param id identifier of the analytic document
 * @param data to be updated in the document
 */
async function SaveAnalytics<T>(id: string, data: T): Promise<void> {
    const doc = AnalyticsDocument(id);
    await doc.set(data);
}

/**
 * Update the mentors Analytics
 * ===================================================
 * 
 * @author Bruno Esparza
 * 
 * @todo improve way to get the mentorFirstTime and avoid reading to their evaluation 
 * 
 * Function to update the analytics of the mentor by reading all the mentors 
 * of the current period and mapping them to a simplified version of the data
 */
export async function UpdateMentorsAnalytics(): Promise<void> {
    const period = await CurrentPeriod();
    const mentors = await ListMentorsPeriod(period.id);

    const analyticsId = `${period.id}-mentors`;
    const mentorsAnalytics = mentors.map(async m => {
        const evaluationDetails = await GetMentorDetailsEvaluation(m.id);
        const mentor = {
            id: m.id,
            displayName: m.displayName,
            area: {
                name: m.area.name,
                id: m.area.reference.id,
            },
            degree: {
                name: m.degree.name,
                id: m.degree.reference.id,
            },
            period: {
                name: m.period.name,
                id: m.period.reference.id
            },
            mentorFirstTime: (evaluationDetails && evaluationDetails.mentorFirstTime),
            accompanimentsCount: m.stats.accompanimentsCount,
            assignedStudentCount: m.stats.assignedStudentCount,
            withAccompaniments: m.students.withAccompaniments.length,
            withoutAccompaniments: m.students.withoutAccompaniments.length,
        };

        return mentor;
    });

    const data = {
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        period: {
            id: period.id,
            name: period.name,
        },
        mentors: await Promise.all(mentorsAnalytics)
    };

    await SaveAnalytics(analyticsId, data);
}

/**
 * Update the students Analytics
 * ===================================================
 * 
 * @author Bruno Esparza
 * 
 * Function to update the student analytics, by reading all the students 
 * of the current period and mapping them to a simplified version of the data
 */
export async function UpdateStudentsAnalytics(): Promise<void> {
    const period = await CurrentPeriod();
    const students = await ListStudentsPeriod(period.id);

    const analyticsId = `${period.id}-students`;

    const studentsAnalytics = students.map(s => {
        const student = {
            area: {
                name: s.area.name,
                id: s.area.reference.id,
            },
            period: {
                name: s.period.name,
                id: s.period.reference.id
            },
            degree: {
                name: s.degree.name,
                id: s.degree.reference.id,
            },
            id: s.id,
            displayName: s.displayName,
            mentor: {
                displayName: s.mentor.displayName,
                id: s.mentor.reference.id,
            },
            accompanimentsCount: s.stats.accompanimentsCount,
        };

        return student;
    });

    const data = {
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        period: {
            id: period.id,
            name: period.name,
        },
        students: studentsAnalytics
    };

    await SaveAnalytics(analyticsId, data);
}

/**
 * Update the Accompaniments Analytics
 * ===================================================
 * 
 * @author Bruno Esparza
 * 
 * Function to update the accompaniments analytics, by reading all the accompaniments 
 * of the current period and mapping them to a simplified version of the data
 */
export async function UpdateAccompanimentsAnalytics(): Promise<void> {
    const period = await CurrentPeriod();
    const accompaniments = await ListAccompanimentsPeriod(period.id);

    const analyticsId = `${period.id}-accompaniments`;
    const accompanimentsAnalytics = accompaniments.map(a => {
        const accompaniment = {
            area: {
                name: a.area.name,
                id: a.area.reference.id
            },
            period: {
                name: a.period.name,
                id: a.period.reference.id
            },
            degree: {
                name: a.degree.name,
                id: a.degree.reference.id
            },
            mentor: {
                displayName: a.mentor.displayName,
                id: a.mentor.reference.id,
            },
            student: {
                displayName: a.student.displayName,
                id: a.student.reference.id,
            },
            followingKind: a.followingKind,
            important: !!a.important,
            id: a.id,
            problems: a.problems,
            reviewed: !a.reviewKey,
            semesterKind: a.semesterKind,
        };

        return accompaniment;
    });

    const data = {
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        period: {
            id: period.id,
            name: period.name,
        },
        accompaniments: accompanimentsAnalytics
    };

    await SaveAnalytics(analyticsId, data);
} 
