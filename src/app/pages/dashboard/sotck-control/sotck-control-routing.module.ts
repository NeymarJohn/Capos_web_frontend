import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './manage-orders/order/order.component';
import { OrderDetailComponent } from './manage-orders/order-detail/order-detail.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'stock-control',
    pathMatch: 'full',
  },
  {
    path: 'manage-orders',
    component: ManageOrdersComponent,
    data: {title: 'Manage Orders'}
  },
  {
    path: 'order-stock',
    component: OrderComponent,
    data: {title: 'Order Stock'}
  },
  {
    path: 'order-detail',
    component: OrderDetailComponent,
    data: {title: 'Order Detail'}
  },
  {
    path: 'receive-stock',
    component: ReceiveStockComponent,
    data: {title: 'Receive Stock'}
  },
  {
    path: 'return-stock',
    component: ReturnStockComponent,
    data: {title: 'Return Stock'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SotckControlRoutingModule { }
