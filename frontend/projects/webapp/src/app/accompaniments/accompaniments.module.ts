import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AccompanimentsRoutingModule } from './accompaniments-routing.module';
import { AccompanimentFormComponent } from './components/accompaniment-form/accompaniment-form.component';
import { InfoAccompanimentComponent } from './components/info-accompaniment/info-accompaniment.component';
import { InfoStudentComponent } from './components/info-student/info-student.component';
import { ReviewFormCardComponent } from './components/review-form-card/review-form-card.component';

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
    AccompanimentFormComponent
  ],
  providers: [
    AccompanimentsRoutingModule.resolvers,
    AccompanimentsRoutingModule.guards,
  ],
})
export class AccompanimentsModule { }
