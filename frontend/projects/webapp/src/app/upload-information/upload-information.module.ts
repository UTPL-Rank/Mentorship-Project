import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReadFileComponent } from './read-file/read-file.component';
import { UploadInformationRoutingModule } from './upload-information-routing.module';

@NgModule({
  declarations: [
    ReadFileComponent,
    UploadInformationRoutingModule.components
  ],
  imports: [
    CommonModule,
    UploadInformationRoutingModule,
    SharedModule
  ]
})
export class UploadInformationModule { }
