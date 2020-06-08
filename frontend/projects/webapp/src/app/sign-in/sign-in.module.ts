import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { SingInRoutingModule } from './sign-in-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SingInRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SingInRoutingModule.pages,
    SignInFormComponent,
  ],
})
export class SignInModule { }
