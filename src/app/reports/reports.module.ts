import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ReportsRoutingModule.pages,
  ],
  providers: [
    ReportsRoutingModule.resolvers,
  ],
})
export class ReportsModule { }
