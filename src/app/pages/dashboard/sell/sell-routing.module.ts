import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SellComponent} from './sell/sell.component';
import {OpenRegisterComponent} from './open-register/open-register.component';
import {SalesHistoryComponent} from './sales-history/sales-history.component';
import {CashManagementComponent} from './cash-management/cash-management.component';
import { CloseRegisterComponent } from './close-register/close-register.component';
import { QuotedSaleComponent } from './quoted-sale/quoted-sale.component';
import { FulfillmentsComponent } from './fulfillments/fulfillments.component';
import { NewSellComponent } from './sell/new_sell.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'selling'
  },
  {
    path: 'selling',
    component: NewSellComponent,
    data: {title: 'Sell'}
  },
  {
    path: 'old-selling',
    component: SellComponent,
    data: {title: 'Sell'}
  },
  {
    path: 'open-register',
    component: OpenRegisterComponent,
    data: {title: 'Open Register'}
  },  
  {
    path: 'sales-history',
    component: SalesHistoryComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('../sell/sales-history/sales-history.module').then(m => m.SalesHistoryModule)
      }
    ]
  },
  {
    path: 'fulfillments',
    component: FulfillmentsComponent,
    data: {title: 'Fulfillments'}
  },
  {
    path: 'quoted-sales',
    component: QuotedSaleComponent,
    data: {title: 'Quoted Sales'}
  },
  {
    path: 'cash-management',
    component: CashManagementComponent,
    data: {title: 'Cash Management'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellRoutingModule { }
