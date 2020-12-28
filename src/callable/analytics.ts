import * as functions from 'firebase-functions';
import { AnalyticsAccompanimentsUseCase } from '../shared/analytics/accompaniments/accompaniments-analytics-use-case';
import { AnalyticsMentorsUseCase } from '../shared/analytics/mentors/mentors-analytics-use-case';
import { AnalyticsStudentsUseCase } from '../shared/analytics/students/students-analytics-use-case';

/**
 * TODO: move to lib
 */
type RequestDTO = {
    periodId: string;
}

type ResponseDTO = boolean;

/**
 * # Analytics Mentors Use Case Caller
 * 
 * @author Bruno Esparza
 *
 * Firebase callable function to update the analytics of the mentors.
 * 
 * return boolean if task completed successfully
 */
async function _AnalyticsMentorsUseCaseCaller(data: RequestDTO): Promise<ResponseDTO> {
    try {
        await AnalyticsMentorsUseCase(data.periodId)
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * # Analytics Students Use Case Caller
 * 
 * @author Bruno Esparza
 *
 * Firebase callable function to update the analytics of the Students.
 * 
 * return boolean if task completed successfully
 */
async function _AnalyticsStudentsUseCaseCaller(data: RequestDTO): Promise<ResponseDTO> {
    try {
        await AnalyticsStudentsUseCase(data.periodId)
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * # Analytics Accompaniments Use Case Caller
 * 
 * @author Bruno Esparza
 *
 * Firebase callable function to update the analytics of the Accompaniments.
 * 
 * return boolean if task completed successfully
 */
async function _AnalyticsAccompanimentsUseCaseCaller(data: RequestDTO): Promise<ResponseDTO> {
    try {
        await AnalyticsAccompanimentsUseCase(data.periodId)
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const AnalyticsMentorsUseCaseCaller = functions.https.onCall(_AnalyticsMentorsUseCaseCaller);
export const AnalyticsAccompanimentsUseCaseCaller = functions.https.onCall(_AnalyticsAccompanimentsUseCaseCaller);
export const AnalyticsStudentsUseCaseCaller = functions.https.onCall(_AnalyticsStudentsUseCaseCaller);