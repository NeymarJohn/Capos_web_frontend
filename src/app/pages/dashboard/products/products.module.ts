import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { PriceBooksComponent } from './price-books/price-books.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { BrandComponent } from './brand/brand.component';
import { AttributeComponent } from './attribute/attribute.component';
import { ProductTagComponent } from './product-tag/product-tag.component';
import { ProductAddComponent } from './products/product-add/product-add.component';
import { ShareModule} from '@shared/share.module';
import { AngularEditorModule} from '@kolkov/angular-editor';
import { NgSelectModule} from '@ng-select/ng-select';
import { NewItemDlgComponent } from './new-item-dlg/new-item-dlg.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductImportComponent } from './products/product-import/product-import.component';
import { TagDlgComponent } from './product-tag/tag-dlg/tag-dlg.component';
import { BrandDlgComponent } from './brand/brand-dlg/brand-dlg.component';
import { AttributeDlgComponent } from './attribute/attribute-dlg/attribute-dlg.component';
import { TypeDlgComponent } from './product-type/type-dlg/type-dlg.component';
import { SupplierActionComponent } from './suppliers/supplier-action/supplier-action.component';
import { RemoveItemDlgComponent } from './remove-item-dlg/remove-item-dlg.component';
import { RouterModule } from '@angular/router';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { EditPriceBookComponent } from './price-books/edit-price-book/edit-price-book.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { EditAttributeValueDlgComponent } from './products/edit-attribute-value-dlg/edit-attribute-value-dlg.component';
import { BundlesComponent } from './bundles/bundles.component';
import { EditBundleComponent } from './bundles/edit-bundle/edit-bundle.component';
import { VariantsDlgComponent } from './bundles/variants-dlg/variants-dlg.component';

@NgModule({
  declarations: [
    PriceBooksComponent, 
    ProductTypeComponent,
    SuppliersComponent, 
    BrandComponent, 
    ProductTagComponent, 
    ProductAddComponent,
    NewItemDlgComponent, 
    ProductDetailComponent, 
    ProductImportComponent, 
    TagDlgComponent,
    BrandDlgComponent, 
    TypeDlgComponent,     
    SupplierActionComponent, 
    RemoveItemDlgComponent,
    EditPriceBookComponent,
    AttributeComponent,
    AttributeDlgComponent,
    EditAttributeValueDlgComponent,
    BundlesComponent,
    EditBundleComponent,
    VariantsDlgComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ShareModule,
    AngularEditorModule,
    NgSelectModule,
    NgxMatMomentModule,
    RouterModule,
    MaterialFileInputModule
  ]
})
export class ProductsModule { }
