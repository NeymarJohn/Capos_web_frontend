import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreBatchCashierComponent } from './batch_cashier/store-batch-cashier.component';
import { StoreEmployeeTimesheetComponent } from './employee_timesheet/store-employee-timesheet.component';
import { StoreModulesComponent } from './modules/store-modules.component';
import { StoreOthersComponent } from './others/store-others.component';
import { StorePrintComponent } from './print/store-print.component';
import { StoreSystemComponent } from './system/store-system.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'modules',
    pathMatch: 'full'
  },
  {
    path: 'modules',
    component: StoreModulesComponent,
    data: {title: 'Modules - Store Policy'}
  },
  {
    path: 'print',
    component: StorePrintComponent,
    data: {title: 'Print - Store Policy'}
  },
  {
    path: 'batch_cashier_closing',
    component: StoreBatchCashierComponent,
    data: {title: 'Batch/Cashier Closing - Store Policy'}
  },
  {
    path: 'others',
    component: StoreOthersComponent,
    data: {title: 'Others - Store Policy'}
  },
  {
    path: 'system',
    component: StoreSystemComponent,
    data: {title: 'System - Store Policy'}
  },
  {
    path: 'employee_timesheet',
    component: StoreEmployeeTimesheetComponent,
    data: {title: 'Employee / Timesheet - Store Policy'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorePolicyRoutingModule { }
