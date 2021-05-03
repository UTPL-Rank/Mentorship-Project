import { CurrentPeriod, GetAcademicPeriod, ValidPeriod } from "../../../utils/period-utils";
import { ListStudentsPeriod } from "../../../utils/student-utils";
import { SaveAnalyticsService } from "../save-analytics-service";
import { GenerateStudentsAnalyticsService } from "./generate-students-analytics-service";

/**
 * # Students Analytics Use Case
 * 
 * @author Bruno Esparza
 * 
 * Use Case to create (or update) the students analytics, by reading all the students 
 * of an specific academic period and mapping them to a simplified version of the data.
 * 
 * if the `periodIdentifier` is not defined, it will be assumed to generate the analytics of the students in the current period
 * 
 * @param periodIdentifier period to generate the analytics of.
 */
export async function AnalyticsStudentsUseCase(periodIdentifier?: string): Promise<void> {

    const period = await (!!periodIdentifier ? GetAcademicPeriod(periodIdentifier) : CurrentPeriod());

    const validPeriod = ValidPeriod(period);

    const students = await ListStudentsPeriod(validPeriod.id);

    const studentAnalytics = GenerateStudentsAnalyticsService(validPeriod, students);

    await SaveAnalyticsService(studentAnalytics);
} 