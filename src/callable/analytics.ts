import * as functions from 'firebase-functions';
import { UpdateAccompanimentsAnalytics, UpdateMentorsAnalytics, UpdateStudentsAnalytics } from '../utils/analytics-utils';

/**
 * Analytics Mentor
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name AnalyticsMentors callable function name
 * 
 * Firebase callable function to update the analytics of the mentors.
 * 
 * return boolean if task completed successfully
 */
export const AnalyticsMentors = functions.https.onCall(async _ => {
    try {
        await UpdateMentorsAnalytics()
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
});

/**
 * Analytics Student
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name AnalyticsStudents callable function name
 * 
 * Firebase callable function to update the analytics of the Students.
 * 
 * return boolean if task completed successfully
 */
export const AnalyticsStudents = functions.https.onCall(async _ => {
    try {
        await UpdateStudentsAnalytics()
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
});

/**
 * Analytics Accompaniment
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name AnalyticsAccompaniments callable function name
 * 
 * Firebase callable function to update the analytics of the Accompaniments.
 * 
 * return boolean if task completed successfully
 */
export const AnalyticsAccompaniments = functions.https.onCall(async _ => {
    try {
        await UpdateAccompanimentsAnalytics()
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
});