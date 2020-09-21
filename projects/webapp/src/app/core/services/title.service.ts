import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'projects/webapp/src/environments/environment';
import { filter } from 'rxjs/operators';

/**
 * Update the title of the page with the base title defined in de `index.html`.
 * Also every time you navigate to a different page the title is reseated to base title;
 * if you need to update the title, update the title in the `index.html`.
 */
@Injectable({ providedIn: 'root' })
export class TitleService {


  constructor(
    private readonly title: Title,
    private readonly router: Router
  ) {
    this.baseTitle = title.getTitle();

    // add a developer build title notice
    if (!environment.production) {
      this.baseTitle = this.baseTitle.concat(' | 👨‍💻 Developer Build');
      this.title.setTitle(this.baseTitle);
    }

    this.enableResetTitleOnNavigate();
  }

  /**
   * base title page, title defined in the `index.html`
   */
  private baseTitle: string;

  /**
   * Update the title of the page
   * @param title new title of the page
   */
  public setTitle(title: string): void {
    this.title.setTitle(title + ' | ' + this.baseTitle);
  }

  /**
   * Get current title
   */
  public getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * enable reset title every time the user navigates to a new page.
   */
  private enableResetTitleOnNavigate(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_ => this.title.setTitle(this.baseTitle));
  }
}
