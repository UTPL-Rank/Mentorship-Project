import { firestore } from "firebase-admin";
import { ListMentorsCurrentPeriod } from "./mentors-utils";
import { CurrentPeriod } from "./period-utils";
import { dbFirestore } from "./utils";

type MentorAnalytics = any;

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
