import * as functions from 'firebase-functions';
import { AnalyticsAccompanimentsUseCase } from '../shared/analytics/accompaniments/accompaniments-analytics-use-case';
import { AnalyticsMentorsUseCase } from '../shared/analytics/mentors/mentors-analytics-use-case';
import { AnalyticsStudentsUseCase } from '../shared/analytics/students/students-analytics-use-case';

/**
 * Run every day at 23h00
 */
const cronSchedule = '0 23 * * *';

/**
 * # Analytics Calculator Cron
 * 
 * @author Bruno Esparza
 *
 * Function to calculate the analytics of the page every time.
 *
 * The data that the function calculate is:
 * - Mentors analytics
 * - Students analytics
 * - Accompaniments analytics
 */
async function _AnalyticsCalculatorCron() {
    const tasks = [
        AnalyticsMentorsUseCase(),
        AnalyticsStudentsUseCase(),
        AnalyticsAccompanimentsUseCase(),
    ];

    try {
        await Promise.all(tasks);
    } catch (err) {
        console.error(err);
    }
};

export const AnalyticsCalculatorCron = functions.pubsub.schedule(cronSchedule).onRun(_AnalyticsCalculatorCron);