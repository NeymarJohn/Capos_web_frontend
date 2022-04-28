import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SotckControlRoutingModule } from './sotck-control-routing.module';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { OrderComponent } from './manage-orders/order/order.component';
import { OrderDetailComponent } from './manage-orders/order-detail/order-detail.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { VariantsDlgComponent } from './manage-orders/variants-dlg/variants-dlg.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';


@NgModule({
  declarations: [    
    ManageOrdersComponent,
    ReceiveStockComponent, 
    ReturnStockComponent,
    VariantsDlgComponent,
    OrderComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    SotckControlRoutingModule,
    MaterialFileInputModule
  ]
})
export class SotckControlModule { }
