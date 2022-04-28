import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeComponent} from '@page/dashboard/employees/employee/employee.component';
import {GroupComponent} from '@page/dashboard/employees/group/group.component';
import { EmployeeActionComponent } from "@page/dashboard/employees/employee/employee-action/employee-action.component";
import { EmployeeImportComponent } from "@page/dashboard/employees/employee/employee-import/employee-import.component";
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { RolesComponent } from './roles/roles.component';
import { RoleActionComponent } from './roles/role-action/role-action.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersComponent,
    data: {title: 'User/Employee'}
  },
  {
    path: 'user-action',
    component: EditUserComponent,
    data: {title: 'User/Employee'}
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: {title: 'User Roles'}
  },
  {
    path: 'role-action',
    component: RoleActionComponent,
    data: {title: 'User Roles'}
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    data: {title: 'Employees'}
  },
  {
    path: 'employee-action',
    component: EmployeeActionComponent
  },
  {
    path: 'group',
    component: GroupComponent,
    data: {title: 'Employee Group'}
  },
  {
    path: 'employee-import',
    component: EmployeeImportComponent,
    data: {title: 'Import Employee'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {
}
