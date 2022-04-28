import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { OnlineStoreComponent } from './online-store/online-store.component';
import { OrderDetailComponent } from './orders/detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { SettingsComponent } from './settings/settings.component';
import { PagesComponent } from './pages/pages.component';
import { ProductsComponent } from '@app/pages/dashboard/products/products/products.component';
import { ProductAddComponent } from '@app/pages/dashboard/products/products/product-add/product-add.component';
import { ProductDetailComponent } from '@app/pages/dashboard/products/products/product-detail/product-detail.component';
import { ProductImportComponent } from '@app/pages/dashboard/products/products/product-import/product-import.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {title: 'Dashboard - Ecommerce'}
  },
  {
    path: 'collections',
    component: CollectionsComponent,
    data: {title: 'Collections - Ecommerce'}
  },
  {
    path: 'edit-collection',
    component: EditCollectionComponent,
    data: {title: 'Edit Collection - Ecommerce'}
  },
  {
    path: 'product',
    component: ProductsComponent,
    data: {title: 'Products - Ecommerce'}
  },
  {
    path: 'product-add',
    component: ProductAddComponent,
    data: {title: 'Edit Product - Ecommerce'}
  },
  {
    path: 'product-import',
    component: ProductImportComponent,
    data: {title: 'Import Product - Ecommerce'}
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent,
    data: {title: 'Product Detail - Ecommerce'}
  },
  {
    path: 'orders',
    component: OrdersComponent,
    data: {title: 'Orders - Ecommerce'}    
  },
  {
    path: 'order-detail',
    component: OrderDetailComponent,
    data: {title: 'Order Detail - Ecommerce'}
  },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./settings/settings.module').then(m => m.SettingsModule)
      }
    ]
  },
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>import('./pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: 'online-store',
    component: OnlineStoreComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
