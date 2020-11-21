import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BestMentorsComponent } from './components/best-mentors/best-mentors.component';
import { MentorsTableComponent } from './components/mentors-table/mentors-table.component';
import { MentorsRoutingModule } from './mentors-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MentorsRoutingModule,
    SharedModule,
  ],
  declarations: [
    MentorsRoutingModule.pages,
    MentorsTableComponent,
    BestMentorsComponent,
  ],
})
export class MentorsModule { }
