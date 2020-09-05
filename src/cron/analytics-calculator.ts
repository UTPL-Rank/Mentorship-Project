import * as functions from 'firebase-functions';
import { UpdateAccompanimentsAnalytics, UpdateMentorsAnalytics, UpdateStudentsAnalytics } from '../utils/analytics-utils';

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
 * - Students analytics
 * - Accompaniments analytics
 */
export const AnalyticsCalculator = functions.pubsub.schedule('0 23 * * *').onRun(async () => {
    const tasks = [
        UpdateMentorsAnalytics(),
        UpdateStudentsAnalytics(),
        UpdateAccompanimentsAnalytics(),
    ];

    try {
        await Promise.all(tasks);
    } catch (err) {
        console.error(err);
    }
});