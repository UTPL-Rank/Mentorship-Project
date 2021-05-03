import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatisticLabelComponent } from './statistic-label/statistic-label.component';
import { StatisticPercentageComponent } from './statistic-percentage/statistic-percentage.component';
import { StatisticValueComponent } from './statistic-value/statistic-value.component';
import { StatisticComponent } from './statistic.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatisticComponent, StatisticLabelComponent, StatisticValueComponent, StatisticPercentageComponent],
  exports: [StatisticComponent, StatisticLabelComponent, StatisticValueComponent, StatisticPercentageComponent],
})
export class StatisticModule { }
