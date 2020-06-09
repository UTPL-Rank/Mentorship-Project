import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccompanimentsTableComponent } from './components/accompaniments-table/accompaniments-table.component';
import { InfoMentorComponent } from './components/info-mentor/info-mentor.component';
import { AcademicCycleNamePipe } from './pipes/academic-cycle-name.pipe';
import { FollowingNamePipe } from './pipes/following-name.pipe';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [AcademicCycleNamePipe, InfoMentorComponent, AccompanimentsTableComponent, FollowingNamePipe],
  exports: [AcademicCycleNamePipe, InfoMentorComponent, AccompanimentsTableComponent, FollowingNamePipe]
})
export class SharedModule { }
