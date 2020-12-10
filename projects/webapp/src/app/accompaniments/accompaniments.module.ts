import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AccompanimentsRoutingModule } from './accompaniments-routing.module';
import { AccompanimentFormComponent } from './components/accompaniment-form/accompaniment-form.component';
import { InfoAccompanimentComponent } from './components/info-accompaniment/info-accompaniment.component';
import { InfoStudentComponent } from './components/info-student/info-student.component';
import { ReviewFormCardComponent } from './components/review-form-card/review-form-card.component';
import { SaveAccompanimentService } from './components/services/save-accompaniment.service';
import { AccompanimentKindPipe } from './pipes/accompaniment-kind.pipe';
import { ExportAccompanimentsCSVService } from './services/export-accompaniments-csv.service';

@NgModule({
  imports: [
    CommonModule,
    AccompanimentsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    AccompanimentsRoutingModule.pages,
    InfoStudentComponent,
    ReviewFormCardComponent,
    InfoAccompanimentComponent,
    AccompanimentFormComponent,
    AccompanimentKindPipe,
  ],
  providers: [
    AccompanimentsRoutingModule.resolvers,
    AccompanimentsRoutingModule.guards,
    SaveAccompanimentService,
    ExportAccompanimentsCSVService,
  ],
})
export class AccompanimentsModule { }
