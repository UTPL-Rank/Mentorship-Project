import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { PieComponent } from './pie/pie.component';


@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
  ],
  declarations: [PieComponent],
  exports: [PieComponent],
})
export class ChatsModule { }
