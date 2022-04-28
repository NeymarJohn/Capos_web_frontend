import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { GeneralComponent } from './general/general.component';
import { OutletRegistersComponent } from './outlet-registers/outlet-registers.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { SalesTaxesComponent } from './sales-taxes/sales-taxes.component';
import { UsersComponent } from './users/users.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { AccountComponent } from './account/account.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '@app/_shared/share.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { RegisterPlanComponent } from './register-plan/register-plan.component';
import { EditSalesTaxComponent } from './sales-taxes/edit-sales-tax/edit-sales-tax.component';
import { EditOutletComponent } from './outlet-registers/edit-outlet/edit-outlet.component';
import { RoleActionComponent} from './users/roles/role-action/role-action.component';
import { AddRegisterDlgComponent } from './outlet-registers/add-register-dlg/add-regisger-dlg.component';
import { PaymentDlgComponent } from './account/payment-dlg/payment-dlg.component';
import { CustomerPointGiftComponent } from './customer-point-gift/customer-point-gift.component';
import { StorePolicyComponent } from './store-policy/store-policy.component';
import { StationComponent } from './station/station.component';
import { StoreManagementComponent } from './store-management/store-management.component';
import { ConfirmationDialogComponent } from './station/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    GeneralComponent, 
    OutletRegistersComponent, 
    PaymentTypesComponent, 
    SalesTaxesComponent, 
    EditSalesTaxComponent,
    UsersComponent, 
    MessageBoxComponent, 
    AccountComponent, 
    RegisterPlanComponent, 
    EditOutletComponent,
    RoleActionComponent,
    AddRegisterDlgComponent,
    PaymentDlgComponent,
    CustomerPointGiftComponent,
    StorePolicyComponent,
    StationComponent,
    StoreManagementComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    UiSwitchModule,
    SetupRoutingModule
  ]
})
export class SetupModule { }
