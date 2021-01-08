import { SGMAcademicPeriod, SGMAnalytics, SGMMentor } from "@utpl-rank/sgm-helpers";
import { FindOneMentorFromPeriod } from "../../../utils/mentors-utils";
import { UndefinedCleaner } from "../../utils/undefined-cleaner";

/**
 * To find whether the mentor has being in other periods, first search for one entry of the mentor email in the
 * mentors collection, but with the last period id, also limit the response to one mentor

 * @param mentor to find if first time
 * @param currentPeriod data of the academic period
 */
async function FindIfMentorFirstTime(mentor: SGMMentor.readDTO, currentPeriod: SGMAcademicPeriod.readDTO): Promise<boolean> {

    if (!currentPeriod.prevPeriodId)
        return false;

    const lastPeriodMentor = await FindOneMentorFromPeriod(mentor.email, currentPeriod.prevPeriodId);

    return !!lastPeriodMentor;
}

/**
 * Turn a complete mentor into an analytics entry and remove un-used values in the process
 *
 * @param mentor data to be transformed
 * @param currentPeriod data of the current period
 */
async function TransformMentorToAnEntry(mentor: SGMMentor.readDTO, currentPeriod: SGMAcademicPeriod.readDTO): Promise<SGMAnalytics.MentorEntry> {

    const mentorFirstTime = await FindIfMentorFirstTime(mentor, currentPeriod)

    const newMentor: SGMAnalytics.MentorEntry = {
        area: {
            name: mentor.area.name,
            id: mentor.area.reference.id
        },
        period: {
            name: mentor.period.name,
            id: mentor.period.reference.id
        },
        degree: {
            name: mentor.degree.name,
            id: mentor.degree.reference.id
        },
        id: mentor.id,
        accompanimentsCount: mentor.stats.accompanimentsCount,
        assignedStudentCount: mentor.stats.assignedStudentCount,
        mentorFirstTime,
        withAccompaniments: mentor.students.withAccompaniments.length,
        withoutAccompaniments: mentor.students.withoutAccompaniments.length,
        displayName: mentor.displayName,
    };

    return UndefinedCleaner(newMentor);
}

/**
 * Generate an unique identifier to store the analytics report 
 * @param periodData academic witch correspond to the analytics being generated
 */
function GenerateAnalyticsIdentifier(periodData: SGMAcademicPeriod.readDTO): string {
    return `${periodData.id}-mentors`;
}

/**
 * ## Generate Mentors Analytics Service
 * 
 * @author Bruno Esparza
 * 
 * Service to generate an analytics report of mentors
 * @param period period where the data comes from
 * @param mentors list of mentors to be transformed into an analytics report
 */
export async function GenerateMentorsAnalyticsService(period: SGMAcademicPeriod.readDTO, mentors: Array<SGMMentor.readDTO>): Promise<SGMAnalytics.MentorsAnalytics> {

    const id = GenerateAnalyticsIdentifier(period);

    const analyticsMentorsPromise: Array<Promise<SGMAnalytics.MentorEntry>> = mentors.map(async m => await TransformMentorToAnEntry(m, period));
    const analyticsMentors: Array<SGMAnalytics.MentorEntry> = await Promise.all(analyticsMentorsPromise);

    const response: SGMAnalytics.MentorsAnalytics = {
        id,
        mentors: analyticsMentors,
        lastUpdated: Date.now(),
        period: { id: period.id, name: period.name },
    };

    return response;
}
