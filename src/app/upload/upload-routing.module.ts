import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDegreesComponent } from './pages/upload-degrees/upload-degrees.component';
import { UploadMentorsComponent } from './pages/upload-mentors/upload-mentors.component';
import { UploadStudentsComponent } from './pages/upload-students/upload-students.component';
import { UploadIntegratorsComponent } from './upload-integrators/upload-integrators.component';
import { UploadComponent } from './upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent,
    children: [
      { path: 'mentores', component: UploadMentorsComponent },
      { path: 'estudiantes', component: UploadStudentsComponent },
      { path: 'carreras', component: UploadDegreesComponent },
      { path: 'integradores', component: UploadIntegratorsComponent },
      { path: '**', redirectTo: 'mentores' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule {
  static pages = [UploadComponent, UploadIntegratorsComponent, UploadMentorsComponent, UploadStudentsComponent, UploadDegreesComponent];
}
