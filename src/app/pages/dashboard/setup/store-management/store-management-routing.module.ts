import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreManagementPaymentComponent } from './store-management-payment/store-management-payment.component';
import { StoreManagementReceiptComponent } from './store-management-receipt/store-management-receipt.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment',
    pathMatch: 'full'
  },
  {
    path: 'payment',
    component: StoreManagementPaymentComponent,
    data: {title: 'Payment - Store Management'}
  },
  {
    path: 'receipt',
    component: StoreManagementReceiptComponent,
    data: {title: 'Receipt - Store Management'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreManagementRoutingModule { }
