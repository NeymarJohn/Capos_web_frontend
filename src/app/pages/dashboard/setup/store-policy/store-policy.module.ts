import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { StorePolicyRoutingModule } from './store-policy-routing.module';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { StoreModulesComponent } from './modules/store-modules.component';
import { StorePrintComponent } from './print/store-print.component';
import { StoreBatchCashierComponent } from './batch_cashier/store-batch-cashier.component';
import { StoreOthersComponent } from './others/store-others.component';
import { StoreSystemComponent } from './system/store-system.component';
import { StoreEmployeeTimesheetComponent } from './employee_timesheet/store-employee-timesheet.component';

@NgModule({
  declarations: [StoreModulesComponent, StorePrintComponent, 
    StoreBatchCashierComponent, StoreOthersComponent, StoreSystemComponent, StoreEmployeeTimesheetComponent],
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    ShareModule,
    StorePolicyRoutingModule,
    MaterialFileInputModule
  ],  
})
export class StorePolicyModule { }
