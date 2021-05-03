import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in.component';


const routes: Routes = [
  { path: '', component: SignIn }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingInRoutingModule {
  static pages = [SignIn];
}
