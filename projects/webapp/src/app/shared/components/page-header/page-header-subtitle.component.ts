import { Component } from '@angular/core';

@Component({
  selector: 'sgm-page-header-subtitle',
  template: `
  <h2 class="small m-0">
    <ng-content></ng-content>
  </h2>
  `,
})
export class PageHeaderSubtitleComponent {
  constructor() { }
}
