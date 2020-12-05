import { Observable } from 'rxjs';

/**
 * TODO: add options
 */
// tslint:disable-next-line: no-empty-interface
export interface IExportOptions { }

/**
 * Base interface for implementing an exporting method
 */
export interface IExport<T extends IExportOptions = {}> {

  /**
   * Trigger to start exporting data
   * @returns an observable when operation competes successfully or something went wrong
   */
  export$: (options?: T) => Observable<boolean>;
}
