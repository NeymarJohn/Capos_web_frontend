import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { GroupComponent } from './group/group.component';
import { EmployeeImportComponent } from './employee/employee-import/employee-import.component';
import { ShareModule } from '@shared/share.module';
import { EmployeeActionComponent } from './employee/employee-action/employee-action.component';
import { PayAccountDlgComponent } from './employee/pay-account-dlg/pay-account-dlg.component';
import { EditGroupComponent } from './group/edit-group/edit-group.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { TimesheetDlgComponent } from './users/timesheet-dlg/timesheet-dlg.component';
import { RolesComponent } from './roles/roles.component';
import { RoleActionComponent } from './roles/role-action/role-action.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [
    EmployeeComponent, 
    GroupComponent, 
    EmployeeImportComponent, 
    EmployeeActionComponent, 
    PayAccountDlgComponent,
    EditGroupComponent,
    UsersComponent,
    EditUserComponent,
    RolesComponent,
    RoleActionComponent,
    TimesheetDlgComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    ShareModule,
    MaterialFileInputModule,
    NgxMatDatetimePickerModule
  ]
})
export class EmployeesModule { }
