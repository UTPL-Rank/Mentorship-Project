import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReadFileComponent } from './components/read-file/read-file.component';
import { UploadRoutingModule } from './upload-routing.module';

@NgModule({
  declarations: [
    ReadFileComponent,
    UploadRoutingModule.pages
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
    SharedModule
  ]
})
export class UploadModule { }
