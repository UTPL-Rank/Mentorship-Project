import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from './card/card.module';
import { AccompanimentsTableComponent } from './components/accompaniments-table/accompaniments-table.component';
import { InfoMentorComponent } from './components/info-mentor/info-mentor.component';
import { MentorFilterSelectorComponent } from './components/mentor-filter-selector/mentor-filter-selector.component';
import { MentorNavbarComponent } from './components/mentor-navbar/mentor-navbar.component';
import { MentorStatsComponent } from './components/mentor-stats/mentor-stats.component';
import { PageHeaderControlsComponent } from './components/page-header/page-header-controls.component';
import { PageHeaderSubtitleComponent } from './components/page-header/page-header-subtitle.component';
import { PageHeaderTitleComponent } from './components/page-header/page-header-title.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SigCanvasComponent } from './components/sig-canvas/sig-canvas.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { IconsModule } from './icons/icons.module';
import { AcademicCycleNamePipe } from './pipes/academic-cycle-name.pipe';
import { FollowingNamePipe } from './pipes/following-name.pipe';
import { QualificationValuePipe } from './pipes/qualification-value.pipe';
import { SemesterNamePipe } from './pipes/semester-name.pipe';
import { PlotsModule } from './plots/ plots.module';
import { StatisticModule } from './statistic/statistic.module';
import { InfoAccompanimentComponent } from './components/info-accompaniment/info-accompaniment.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    StatisticModule,
    PlotsModule,
    IconsModule,
     
  ],
  declarations: [
    AcademicCycleNamePipe,
    InfoMentorComponent,
    [AccompanimentsTableComponent, StudentsTableComponent],
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
    MentorFilterSelectorComponent,
    InfoAccompanimentComponent
    
  ],
  exports: [
    AcademicCycleNamePipe,
    InfoMentorComponent,
    [AccompanimentsTableComponent, StudentsTableComponent],
    PlotsModule,
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
    MentorFilterSelectorComponent,
    StatisticModule,
    CardModule,
    IconsModule,
    
  ]
})
export class SharedModule { }
