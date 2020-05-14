import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'projects/webapp/src/environments/environment';

/**
 * Update the title of the page with the base title defined in de `index.html`.
 * Also every time you navigate to a different page the title is reseated to base title;
 * if you need to update the title, update the title in the `index.html`.
 */
@Injectable({ providedIn: 'root' })
export class TitleService {

  /**
   * base title page, title defined in the `index.html`
   */
  private baseTitle: string;

  constructor(private readonly title: Title, private readonly router: Router) {
    this.baseTitle = title.getTitle();

    // add a developer build title notice
    if (!environment.production)
      this.baseTitle = this.baseTitle.concat(' | 👨‍💻 Developer Build');


    // TODO: enable route title update
    // this.enableResetTitleNavigate();
  }

  /**
   * Update the title of the page
   * @param title new title of the page
   */
  public setTitle(title: string) {
    this.title.setTitle(title + ' | ' + this.baseTitle);
  }

  /**
   * Get current title
   */
  public getTitle() {
    return this.title.getTitle();
  }

  // /**
  //  * TODO: needs fix, update when routes changes
  //  * reset the page title every time a user enters another page
  //  */
  // private enableResetTitleNavigate() {
  //   let startURl: string;

  //   this.router.events
  //     .pipe(
  //       filter(event => event instanceof NavigationEnd || event instanceof NavigationStart),
  //     )
  //     .subscribe(event => {

  //       if (event instanceof NavigationStart)
  //         startURl = this.router.url;

  //       else if (startURl && event instanceof NavigationEnd) {
  //         const [initialURL] = (startURl).split('?');
  //         // tslint:disable-next-line: no-string-literal
  //         const [finalURL] = (event['url'] as string).split('?');
  //         console.log({ initialURL, finalURL });

  //         if (initialURL !== finalURL)
  //           this.title.setTitle(this.baseTitle);
  //       }
  //     });
  // }
}
