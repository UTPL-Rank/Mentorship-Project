import { Component } from '@angular/core';

@Component({
  selector: 'sgm-page-header',
  template: `
    <header class="pt-6 pb-4 pt-md-9 pb-md-6 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-md">

            <!-- titles container -->
            <div class="mb-2">
              <!-- page subtitle -->
              <ng-content select="sgm-page-header-subtitle"></ng-content>

              <!-- page title -->
              <ng-content select="sgm-page-header-title"></ng-content>
            </div>

            <!-- page lead -->
            <div class="mt-3 mb-0 text-muted">
              <ng-content></ng-content>
            </div>

          </div>

          <!-- actions column -->
          <div class="col-auto">
            <ng-content select="sgm-page-header-controls"></ng-content>
          </div>
        </div>
      </div>
    </header>
`
})
export class PageHeaderComponent { }
