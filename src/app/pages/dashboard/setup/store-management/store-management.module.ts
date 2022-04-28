import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { StoreManagementRoutingModule } from './store-management-routing.module';
import { StoreManagementPaymentComponent } from './store-management-payment/store-management-payment.component';
import { StoreManagementReceiptComponent } from './store-management-receipt/store-management-receipt.component';


@NgModule({
  declarations: [StoreManagementPaymentComponent, StoreManagementReceiptComponent],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    StoreManagementRoutingModule
  ]
})
export class StoreManagementModule { }
