import { firestore } from "firebase-admin";
import { ListAccompanimentsCurrentPeriod } from "./accompaniments-utils";
import { ListMentorsCurrentPeriod } from "./mentors-utils";
import { CurrentPeriod } from "./period-utils";
import { ListStudentsCurrentPeriod } from "./student-utils";
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
 * Function to update the analytics of the mentor by reading all the mentors 
 * of the current period and mapping them to a simplified version of the data
 */
export async function UpdateMentorsAnalytics(): Promise<void> {
    console.log('TODO: transform mentors data');
    const period = await CurrentPeriod();
    const mentors = await ListMentorsCurrentPeriod();

    const analyticsId = `${period.id}-mentors`;
    const mentorsAnalytics = mentors.map(m => {
        return m;
    });

    const data = {
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        period: {
            id: period.id,
            name: period.name,
        },
        mentors: mentorsAnalytics
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
    console.log('TODO: transform students data');
    const period = await CurrentPeriod();
    const students = await ListStudentsCurrentPeriod();

    const analyticsId = `${period.id}-students`;
    const studentsAnalytics = students.map(s => {
        return s;
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
    console.log('TODO: transform accompaniments data');
    const period = await CurrentPeriod();
    const accompaniments = await ListAccompanimentsCurrentPeriod();

    const analyticsId = `${period.id}-accompaniments`;
    const accompanimentsAnalytics = accompaniments.map(a => {
        return a;
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
