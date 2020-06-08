import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDegreesComponent } from './pages/upload-degrees/upload-degrees.component';
import { UploadMentorsComponent } from './pages/upload-mentors/upload-mentors.component';
import { UploadShellComponent } from './pages/upload-shell/upload-shell.component';
import { UploadStudentsComponent } from './pages/upload-students/upload-students.component';

const routes: Routes = [
  {
    path: '',
    component: UploadShellComponent,
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
export class UploadRoutingModule {
  static pages = [UploadShellComponent, UploadMentorsComponent, UploadStudentsComponent, UploadDegreesComponent];
}
