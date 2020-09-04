import * as functions from 'firebase-functions';
import { UpdateMentorsAnalytics } from '../utils/analytics-utils';

/**
 * Analytics Calculator
 * ==========================================================
 * 
 * @author Bruno Esparza
 * 
 * @name AnalyticsCalculator cron function name
 * 
 * Function Fires every day at 23h00
 * 
 * Firebase function that update the analytics of the page.
 * 
 * The data that the function calculate is:
 * - Mentors analytics
 * - TODO: Students analytics
 * - TODO: Accompaniments analytics
 */
export const AnalyticsCalculator = functions.pubsub.schedule('0 23 * * *').onRun(async _ => {
    const tasks = [UpdateMentorsAnalytics()];

    try {
        await Promise.all(tasks);
    } catch (err) {
        console.error(err);
    }
});