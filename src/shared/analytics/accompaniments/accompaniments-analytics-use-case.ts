import { ListAccompanimentsPeriod } from "../../../utils/accompaniments-utils";
import { CurrentPeriod, GetAcademicPeriod, ValidPeriod } from "../../../utils/period-utils";
import { SaveAnalyticsService } from "../save-analytics-service";
import { GenerateAccompanimentsAnalyticsService } from "./generate-accompaniments-analytics-service";

/**
 * # Accompaniments Analytics Use Case
 * 
 * @author Bruno Esparza
 * 
 * Use Case to create (or update) the accompaniments analytics, by reading all the accompaniments 
 * of an specific academic period and mapping them to a simplified version of the data.
 * 
 * if the `periodIdentifier` is not defined, it will be assumed to generate the analytics of the current period
 * 
 * @param periodIdentifier period to generate the analytics of.
 */
export async function AnalyticsAccompanimentsUseCase(periodIdentifier?: string): Promise<void> {

    const period = await (!!periodIdentifier ? GetAcademicPeriod(periodIdentifier) : CurrentPeriod());

    const validPeriod = ValidPeriod(period);

    const accompaniments = await ListAccompanimentsPeriod(validPeriod.id);

    const accompanimentAnalytics = GenerateAccompanimentsAnalyticsService(validPeriod, accompaniments);

    await SaveAnalyticsService(accompanimentAnalytics);
} 