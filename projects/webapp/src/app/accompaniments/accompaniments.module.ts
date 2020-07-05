import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccompanimentsRoutingModule } from './accompaniments-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AccompanimentsRoutingModule
  ],
  declarations: [
    AccompanimentsRoutingModule.pages,
  ],
  providers: [
    AccompanimentsRoutingModule.resolvers,
    AccompanimentsRoutingModule.guards,
  ],
})
export class AccompanimentsModule { }
