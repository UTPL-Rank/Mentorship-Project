import { Observable } from 'rxjs';
import { IStatusData } from './i-status-data';

/**
 * ## Interface to list data
 *
 * @author Bruno Esparza
 *
 * footprint for all services that retrieve data in list form
 */
export abstract class IListDataService<T> {
  /**
   * Get an observable with a list of documents of type `T`
   */
  abstract list$(): Observable<IStatusData<Array<T>>>;
}
