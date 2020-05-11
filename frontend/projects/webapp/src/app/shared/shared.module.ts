import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfoMentorComponent } from './components/info-mentor/info-mentor.component';
import { AcademicCycleNamePipe } from './pipes/academic-cycle-name.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [AcademicCycleNamePipe, InfoMentorComponent],
  exports: [AcademicCycleNamePipe, InfoMentorComponent]
})
export class SharedModule { }
