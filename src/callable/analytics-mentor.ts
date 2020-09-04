import * as functions from 'firebase-functions';
import { UpdateMentorsAnalytics } from '../utils/analytics-utils';

/**
 * Analytics Mentor
 * ============================================================================
 * 
 * @author Bruno Esparza
 * 
 * @name AnalyticsMentor callable function name
 * 
 * Firebase callable function to update the analytics of the mentors.
 * 
 * return boolean if task completed successfully
 */
export const AnalyticsMentor = functions.https.onCall(async _ => {
    try {
        await UpdateMentorsAnalytics()
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
});