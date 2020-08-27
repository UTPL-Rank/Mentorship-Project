import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsService } from './analytics.service';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
  ],
  declarations: [
    AnalyticsRoutingModule.pages,
  ],
  providers: [
    AnalyticsRoutingModule.resolvers,
    AnalyticsRoutingModule.guards,
    AnalyticsService,
  ],
})
export class AnalyticsModule { }
