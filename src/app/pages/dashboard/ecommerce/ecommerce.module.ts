import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { PagesComponent } from './pages/pages.component';
import { OnlineStoreComponent } from './online-store/online-store.component';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/detail/order-detail.component';
import { AddProductDlgComponent } from './orders/add-product-dlg/add-product-dlg.component';
import { CollectionsComponent } from './collections/collections.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
  declarations: [
    DashboardComponent,
    SettingsComponent, 
    PagesComponent,
    OnlineStoreComponent,
    OrderDetailComponent,
    AddProductDlgComponent,
    OrdersComponent,
    CollectionsComponent,
    EditCollectionComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    EcommerceRoutingModule,
    NgSelectModule,
    UiSwitchModule,
    AngularEditorModule,
    MaterialFileInputModule
  ]
})
export class EcommerceModule { }
