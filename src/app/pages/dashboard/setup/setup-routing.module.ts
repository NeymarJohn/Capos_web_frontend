import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { GeneralComponent } from './general/general.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { EditOutletComponent } from './outlet-registers/edit-outlet/edit-outlet.component';
import { OutletRegistersComponent } from './outlet-registers/outlet-registers.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { RegisterPlanComponent } from './register-plan/register-plan.component';
import { SalesTaxesComponent } from './sales-taxes/sales-taxes.component';
import { UsersComponent } from './users/users.component';
import { RoleActionComponent} from './users/roles/role-action/role-action.component';
import { CustomerPointGiftComponent } from './customer-point-gift/customer-point-gift.component';
import { StorePolicyComponent } from './store-policy/store-policy.component';
import { StationComponent } from './station/station.component';
import { StoreManagementComponent } from './store-management/store-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full'
  },
  {
    path: 'general',
    component: GeneralComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./general/general.module').then(m => m.GeneralModule)
      }
    ]
  },
  {
    path: 'account',
    component: AccountComponent,
    data: {title: 'Pricing - Setup'}
  },
  {
    path: 'register-plan',
    component: RegisterPlanComponent,
    data: {title: 'Register Plan - Setup'}
  },

  {
    path: 'outlets',
    component: OutletRegistersComponent,
    data: {title: 'Outlet & Register - Setup'}
  },
  {
    path: 'outlets/edit-outlet',
    component: EditOutletComponent,
    data: {title: 'Edit Outlet & Register - Setup'}
  },
  {
    path: 'payment-types',
    component: PaymentTypesComponent,
    data: {title: 'Payment Types - Setup'}
  },
  {
    path: 'customer-point-gift',
    component: CustomerPointGiftComponent,
    data: {title: 'Customer Point and Gift - Setup'}
  },
  {
    path: 'sales-taxes',
    component: SalesTaxesComponent,
    data: {title: 'Sales Taxes - Setup'}
  },
  {
    path: 'station',
    component: StationComponent,
    data: {title: 'Station Management - Setup'}
  },
  {
    path: 'store-management',
    component: StoreManagementComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./store-management/store-management.module').then(m => m.StoreManagementModule)
      }
    ]
  },
  {
    path: 'store-policy',
    component: StorePolicyComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./store-policy/store-policy.module').then(m => m.StorePolicyModule)
      }
    ]
  },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./users/users.module').then(m => m.UsersModule)
      }
    ]
  },
  {
    path: 'role-action',
    component: RoleActionComponent,
    data: {title: 'Role - Setup'}
  },
  {
    path: 'preferences',
    component: MessageBoxComponent,
    data: {title: 'Preferences - Setup'}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
