import { Observable } from 'rxjs';
import { IStatusData } from '../../shared/modules/i-status-data';

/**
 * ## Interface Analytics Service
 *
 * @author Bruno Esparza
 *
 * Footprint for all analytics services
 */
export abstract class IAnalyticsService<T> {
  /**
   * Get the full document of analytics
   * @param periodId identifier of the period to get the analytics
   */
  abstract get$(periodId: string): Observable<IStatusData<T>>;

  /**
   * Caller to update the analytics of `T`
   * @param periodId identifier of the period to update the analytics
   */
  abstract update$(periodId: string): Observable<boolean>;
}
