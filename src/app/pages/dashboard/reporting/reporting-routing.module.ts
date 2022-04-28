import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryReportsComponent } from './inventory-reports/inventory-reports.component';
import { PaymentReportsComponent } from './payment-reports/payment-reports.component';
import { RegisterClosuresComponent } from './register-closures/register-closures.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { StoreCreditReportsComponent } from './store-credit-reports/store-credit-reports.component';
import { RegisterClosureDetailsComponent } from './register-closures/register-closure-details/register-closure-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sales'
  },
  {
    path: 'sales',
    component: SalesReportsComponent,
    data: {title: 'Sales Reports'}
  },
  {
    path: 'inventory',
    component: InventoryReportsComponent,
    data: {title: 'Inventory Reports'}
  },
  {
    path: 'payment',
    component: PaymentReportsComponent,
    data: {title: 'Payment Reports'}
  },
  {
    path: 'closures',
    component: RegisterClosuresComponent,
    data: {title: 'Register Closures'}
  },
  {
    path: 'closure-details',
    component: RegisterClosureDetailsComponent,
    data: {title: 'Register Closures Details'}
  },
  {
    path: 'store-credit',
    component: StoreCreditReportsComponent,
    data: {title: 'Store Credit Reports'}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
