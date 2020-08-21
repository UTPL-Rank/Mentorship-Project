import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { environment } from 'projects/webapp/src/environments/environment';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Footprint function to implement log events
 */
type LoggingFunction = (name: string, ...rest: any[]) => void;

/**
 * Log event supported
 */
interface LoggerService {
  info: LoggingFunction;
  log: LoggingFunction;
  warn: LoggingFunction;
  error: LoggingFunction;
}

/**
 * @author Bruno Esparza
 *
 * Log messages to the console when working with the webapp in the develop mode.
 * And  in productions logs event to a server where the data can be tracked,
 * and issues can be address later
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserLoggerService implements LoggerService {

  constructor(
    private readonly eventLog: AngularFireAnalytics,
  ) { }

  /**
   * Attatch a log event to an observable, so when the observable emits any value,
   * it will also log any event to google analytics.
   * The log to google analytics will only work in production mode, so for develop, it wll
   * also print to the console the value of the stream
   *
   * @param name of the event
   * @param value of the new observable
   */
  info$<T>(name: string, value: T): Observable<T> {
    const logger = of(value).pipe(
      mergeMap(async val => {
        if (environment.production)
          try {
            await this.eventLog.logEvent(name);
          } catch { }

        else
          console.info(name, val);

        return val;
      })
    );

    return logger;
  }

  /**
   * Log information to the console and event log
   * @param value data to be logged
   * @param rest optional parameters
   */
  async info(name: string): Promise<void> {
    const eventName = `info-${this.getEventName(name)}`;

    if (!environment.production)
      console.info(eventName);

    else
      try {
        await this.eventLog.logEvent(eventName);
      } catch (err) {
        console.error(err);
      }
  }

  /**
   * Log only to the console
   * @param value data to be logged
   * @param rest optional parameters
   */
  log(name: string, ...rest: any[]): void {
    if (!environment.production)
      console.log(name, rest);
  }

  /**
   * Log only warn to the console
   * @param value data to be logged
   * @param rest optional parameters
   */
  warn(name: string, ...rest: any[]): void {
    if (!environment.production)
      console.warn(name, rest);
  }

  /**
   * Log error to the console
   * @param value data to be logged
   * @param error optional parameters
   */
  async error(name: string, ...error: any[]): Promise<void> {
    const eventName = `error-${this.getEventName(name)}`;

    if (!environment.production)
      console.error(eventName, error);

    else
      try {
        await this.eventLog.logEvent(eventName, { rest: error });
      } catch (err) {
        console.error(err);
      }
  }

  /**
   * Get a valid event name for the analytics console
   * @param eventName name of the event to be logged
   */
  private getEventName(eventName: string): string {
    return eventName
      // clean name and transf orm to lowercase
      .trim().toLowerCase()
      // remove accent and diacritics
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      // split and join every string with more than 3 characters
      .split(' ').filter(s => s.length > 3).join('-');
  }
}
