import { Component } from '@angular/core';

@Component({
  selector: 'sgm-page-header-controls',
  template: `
  <div>
    <ng-content></ng-content>
  </div>
  `,
})
export class PageHeaderControlsComponent {
  constructor() { }
}
