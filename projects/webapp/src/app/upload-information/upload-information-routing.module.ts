import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDegreesComponent } from './upload-degrees/upload-degrees.component';
import { UploadInformationComponent } from './upload-information.component';
import { UploadMentorsComponent } from './upload-mentors/upload-mentors.component';
import { UploadStudentsComponent } from './upload-students/upload-students.component';

const routes: Routes = [
  {
    path: '',
    component: UploadInformationComponent,
    children: [
      { path: 'mentores', component: UploadMentorsComponent },
      { path: 'estudiantes', component: UploadStudentsComponent },
      { path: 'carreras', component: UploadDegreesComponent },
      { path: '**', redirectTo: 'mentores' }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadInformationRoutingModule {
  static components = [UploadInformationComponent, UploadMentorsComponent, UploadStudentsComponent, UploadDegreesComponent];
}
