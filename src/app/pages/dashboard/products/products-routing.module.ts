import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrandComponent} from './brand/brand.component';
import {PriceBooksComponent} from './price-books/price-books.component';
import {ProductTagComponent} from './product-tag/product-tag.component';
import {ProductTypeComponent} from './product-type/product-type.component';
import {ManageOrdersComponent} from '../sotck-control/manage-orders/manage-orders.component';
import {SuppliersComponent} from './suppliers/suppliers.component';
import {ProductsComponent} from './products/products.component';
import {ProductAddComponent} from './products/product-add/product-add.component';
import {ProductImportComponent} from './products/product-import/product-import.component';
import {SupplierActionComponent} from './suppliers/supplier-action/supplier-action.component';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';
import {AttributeComponent} from './attribute/attribute.component';
import { BundlesComponent } from './bundles/bundles.component';
import { EditBundleComponent } from './bundles/edit-bundle/edit-bundle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: {title: 'Products'}
  },
  {
    path: 'product-add',
    component: ProductAddComponent,
    data: {title: 'Add Prdoucts'}
  },
  {
    path: 'product-import',
    component: ProductImportComponent,
    data: {title: 'Import Product'}
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent,
    data: {title: 'Product Details'}
  },
  {
    path: 'brand',
    component: BrandComponent,
    data: {title: 'Brand'}
  },
  {
    path: 'price-books',
    component: PriceBooksComponent,
    data: {title: 'Price Books'}
  },
  {
    path: 'product-tag',
    component: ProductTagComponent,
    data: {title: 'Product Tags'}
  },
  {
    path: 'product-type',
    component: ProductTypeComponent,
    data: {title: 'Product Types'}
  },
  {
    path: 'attribute',
    component: AttributeComponent,
    data: {title: 'Attributes'}
  },
  {
    path: 'manage-orders',
    component: ManageOrdersComponent,
    data: {title: 'Manage Orders'}
  },  
  {
    path: 'supplier',
    component: SuppliersComponent,
    data: {title: 'Suppliers'}
  },
  {
    path: 'supplier-action',
    component: SupplierActionComponent,
  },
  {
    path: 'mix-and-match',
    component: BundlesComponent,
    data: {title: 'Bundle Price'}
  },
  {
    path: 'edit-bundle',
    component: EditBundleComponent,
    data: {title: 'Edit Bundle Price'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
