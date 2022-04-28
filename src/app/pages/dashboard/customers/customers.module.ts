import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerComponent } from './customer/customer.component';
import { GroupComponent } from './group/group.component';
import { CustomerImportComponent } from './customer/customer-import/customer-import.component';
import {ShareModule} from '@shared/share.module';
import { CustomerActionComponent } from './customer/customer-action/customer-action.component';
import { PayAccountDlgComponent } from './customer/pay-account-dlg/pay-account-dlg.component';
import { EditGroupComponent } from './group/edit-group/edit-group.component';

@NgModule({
  declarations: [
    CustomerComponent, 
    GroupComponent, 
    CustomerImportComponent, 
    CustomerActionComponent, 
    PayAccountDlgComponent,
    EditGroupComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ShareModule
  ]
})
export class CustomersModule { }
