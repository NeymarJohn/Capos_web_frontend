import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomerComponent} from '@page/dashboard/customers/customer/customer.component';
import {GroupComponent} from '@page/dashboard/customers/group/group.component';
import {CustomerActionComponent} from "@page/dashboard/customers/customer/customer-action/customer-action.component";
import {CustomerImportComponent} from "@page/dashboard/customers/customer/customer-import/customer-import.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full'
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: {title: 'Customers'}
  },
  {
    path: 'customer-action',
    component: CustomerActionComponent
  },
  {
    path: 'group',
    component: GroupComponent,
    data: {title: 'Customer Group'}
  },
  {
    path: 'customer-import',
    component: CustomerImportComponent,
    data: {title: 'Import Customer'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {
}
