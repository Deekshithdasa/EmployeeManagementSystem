import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAdd } from './components/employee-add/employee-add';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeUpdate } from './components/employee-update/employee-update';
import { EmployeeView } from './components/employee-view/employee-view';
import { Login } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'list', component: EmployeeList, canActivate: [AuthGuard] },
  { path: 'add', component: EmployeeAdd, canActivate: [AuthGuard] },
  { path: 'update', component: EmployeeUpdate, canActivate: [AuthGuard] },
  { path: 'view', component: EmployeeView, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
