import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StudentsHeaderComponent } from './components/students-header/students-header.component';
import { StudentsNavbarComponent } from './components/students-navbar/students-navbar.component';
import { StudentsRoutingModule } from './students-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StudentsRoutingModule,
  ],
  declarations: [
    StudentsRoutingModule.pages,
    StudentsHeaderComponent,
    StudentsNavbarComponent,
  ],
  providers: [
    StudentsRoutingModule.resolvers,
  ],
})
export class StudentsModule { }
