import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccompanimentsTableComponent } from './components/accompaniments-table/accompaniments-table.component';
import { InfoMentorComponent } from './components/info-mentor/info-mentor.component';
import { MentorNavbarComponent } from './components/mentor-navbar/mentor-navbar.component';
import { MentorStatsComponent } from './components/mentor-stats/mentor-stats.component';
import { PageHeaderControlsComponent } from './components/page-header/page-header-controls.component';
import { PageHeaderSubtitleComponent } from './components/page-header/page-header-subtitle.component';
import { PageHeaderTitleComponent } from './components/page-header/page-header-title.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SigCanvasComponent } from './components/sig-canvas/sig-canvas.component';
import { AcademicCycleNamePipe } from './pipes/academic-cycle-name.pipe';
import { FollowingNamePipe } from './pipes/following-name.pipe';
import { QualificationValuePipe } from './pipes/qualification-value.pipe';
import { SemesterNamePipe } from './pipes/semester-name.pipe';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    AcademicCycleNamePipe,
    InfoMentorComponent,
    AccompanimentsTableComponent,
    FollowingNamePipe,
    SemesterNamePipe,
    SigCanvasComponent,
    QualificationValuePipe,
    MentorNavbarComponent,
    MentorStatsComponent,
    PageHeaderComponent,
    PageHeaderControlsComponent,
    PageHeaderSubtitleComponent,
    PageHeaderTitleComponent,
  ],
  exports: [
    AcademicCycleNamePipe,
    InfoMentorComponent,
    AccompanimentsTableComponent,
    FollowingNamePipe,
    SemesterNamePipe,
    SigCanvasComponent,
    QualificationValuePipe,
    MentorNavbarComponent,
    MentorStatsComponent,
    PageHeaderComponent,
    PageHeaderControlsComponent,
    PageHeaderSubtitleComponent,
    PageHeaderTitleComponent,
  ]
})
export class SharedModule { }
