import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OutlineCardSubtitleComponent } from './outline-card-subtitle/outline-card-subtitle.component';
import { OutlineCardTitleComponent } from './outline-card-title/outline-card-title.component';
import { OutlineCardComponent } from './outline-card/outline-card.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OutlineCardComponent, OutlineCardTitleComponent, OutlineCardSubtitleComponent],
  exports: [OutlineCardComponent, OutlineCardTitleComponent, OutlineCardSubtitleComponent],
})
export class CardModule { }
