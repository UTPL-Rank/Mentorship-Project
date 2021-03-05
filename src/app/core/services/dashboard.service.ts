import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Service to give access to other components and edit parts of the dashboard
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private readonly router: Router,
  ) {
    // innit title state
    this.title$.next(this.baseTitle);
    this.enableResetTitleOnNavigate();
  }

  /**
   * pre defined title to show in the panel
   */
  private readonly baseTitle: [string, string] = ['Proyecto', 'Mentores'];

  /**
   * current title
   */
  public readonly title$: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>(this.baseTitle);

  /**
   * title first word
   */
  public readonly titleFirst$ = this.title$.pipe(
    map(t => t[0]),
  );

  /**
   * title second word
   */
  public readonly titleSecond$ = this.title$.pipe(
    map(t => t[1]));

  /**
   * Update the title of the dashboard
   * @param title new title of the dashboard
   */
  public setTitle(title: string): void {
    // validate title length
    const spitted = title.split(' ');
    if (spitted.length !== 2) {
      console.error('Invalid dashboard title length, max length is 2');
      return;
    }

    // set title state
    this.title$.next(spitted as [string, string]);
  }


  /**
   * enable reset title every time the user navigates to a new page.
   */
  private enableResetTitleOnNavigate(): void {
    const resetTitle = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );

    resetTitle.subscribe(_ => this.title$.next(this.baseTitle));
  }
}
