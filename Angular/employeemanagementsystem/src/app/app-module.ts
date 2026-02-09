import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { EmployeeAdd } from './components/employee-add/employee-add';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeUpdate } from './components/employee-update/employee-update';
import { EmployeeView } from './components/employee-view/employee-view';
import { ReactiveFormsModule } from '@angular/forms';
import { Login } from './components/login/login';
import { AuthService } from './services/auth.service';




@NgModule({
  declarations: [
    App,
    EmployeeAdd,
    EmployeeList,
    EmployeeUpdate,
    EmployeeView,
    Login,
    
    
  ],
  imports: [
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
  HttpClientModule,
],

  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    AuthService,
  ],
  bootstrap: [App]
})
export class AppModule { }
