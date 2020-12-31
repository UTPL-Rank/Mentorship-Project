import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MicrosoftSignInComponent } from './components/microsoft-sign-in/microsoft-sign-in.component';
import { SingInRoutingModule } from './sign-in-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SingInRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SingInRoutingModule.pages,
    MicrosoftSignInComponent,
  ],
})
export class SignInModule { }
