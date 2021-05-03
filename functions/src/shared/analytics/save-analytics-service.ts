import { SGMAnalytics } from "@utpl-rank/sgm-helpers";
import { dbDatabase } from "../../utils/utils";

/**
 * constant to reference the repository
 */
const AnalyticsRepository = dbDatabase.ref('analytics');

/**
 * Support for any kind of analytic to be stored
 */
type AnyAnalytics = SGMAnalytics.AccompanimentsAnalytics | SGMAnalytics.MentorsAnalytics | SGMAnalytics.StudentsAnalytics

/**
 * ## Save Analytics Service
 * 
 * @author Bruno Esparza
 * 
 * Service to save the analytics generated in the repository (database).
 * 
 * @param analytics payload to be stored in the database 
 */
export async function SaveAnalyticsService<T extends AnyAnalytics>(analytics: T): Promise<void> {
    const reference = AnalyticsRepository.child(analytics.id);
    await reference.set(analytics);
}