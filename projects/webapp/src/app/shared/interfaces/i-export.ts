import { Observable } from 'rxjs';

/**
 * Base interface for implementing an exporting method
 */
export interface IExport<T> {

  /**
   * Trigger to start exporting data
   * @returns an observable when operation competes successfully or something went wrong
   */
  export$: (options: T) => Observable<boolean>;
}
