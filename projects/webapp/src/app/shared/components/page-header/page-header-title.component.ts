import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'sgm-page-header-title',
  template: `
  <h1 class="text-primary" #title >
    <ng-content></ng-content>
  </h1>
  `,
})
export class PageHeaderTitleComponent implements AfterViewInit {

  @ViewChild('title', { static: true })
  nativeTitle: ElementRef<HTMLTitleElement>;

  constructor(
    private readonly title: TitleService
  ) { }

  ngAfterViewInit() {
    const text = this.nativeTitle.nativeElement.textContent;

    if (!!text)
      this.title.setTitle(text);
  }
}
