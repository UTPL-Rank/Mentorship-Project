import { ListMentorsPeriod } from "../../../utils/mentors-utils";
import { CurrentPeriod, GetAcademicPeriod, ValidPeriod } from "../../../utils/period-utils";
import { SaveAnalyticsService } from "../save-analytics-service";
import { GenerateMentorsAnalyticsService } from "./generate-mentors-analytics-service";

/**
 * # Mentors Analytics Use Case
 * 
 * @author Bruno Esparza
 * 
 * Use Case to create (or update) the mentors analytics, by reading all the mentors 
 * of an specific academic period and mapping them to a simplified version of the data.
 * 
 * if the `periodIdentifier` is not defined, it will be assumed to generate the analytics of the mentors in the current period
 * 
 * @param periodIdentifier period to generate the analytics of.
 */
export async function AnalyticsMentorsUseCase(periodIdentifier?: string): Promise<void> {

    const period = await (!!periodIdentifier ? GetAcademicPeriod(periodIdentifier) : CurrentPeriod());
    console.log({ loadingPeriod: period });

    const validPeriod = ValidPeriod(period);

    const mentors = await ListMentorsPeriod(validPeriod.id);

    const mentorsAnalytics = await GenerateMentorsAnalyticsService(validPeriod, mentors);

    await SaveAnalyticsService(mentorsAnalytics);
} 