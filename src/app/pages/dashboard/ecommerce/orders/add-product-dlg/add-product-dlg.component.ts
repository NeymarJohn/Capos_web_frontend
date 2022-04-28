import {Component, Inject, OnInit, Optional} from '@angular/core';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { Product } from '@app/_classes/product.class';
import { UtilService } from '@app/_services/util.service';
import { AuthService } from '@app/_services/auth.service';
import { CartProduct } from '@app/_classes/cart_product.class';
import { VariantsDlgComponent } from '@page/dashboard/sotck-control/manage-orders/variants-dlg/variants-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import {PasswordDlgComponent} from '@page/dashboard/sell/sell/password-dlg/password-dlg.component';

@Component({
  selector: 'app-add-product-dlg',
  templateUrl: './add-product-dlg.component.html',
  styleUrls: ['./add-product-dlg.component.scss']
})
export class AddProductDlgComponent implements OnInit {

  cart_products:any = [];
  util = UtilFunc;
  form: FormGroup;
  isLoading:boolean = false;
  filteredProducts:Product[] = [];
  selectedProducts:CartProduct[] = [];
  dataSource:any;
  displayedColumns = ['name', 'price', 'tax', 'discount', 'inventory', 'qty', 'total', 'action'];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddProductDlgComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService
  ) {     
    
    this.form = this.fb.group({
      selectedProduct:['']
    })

    this.form.get('selectedProduct').valueChanges.pipe(
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
        this.filteredProducts = [];
      }),
      switchMap(value => this.utilService.get('product/product', {range:'search', keyword: value})
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(response => {        
        let result:any = response;
        if(result && result.body) {
          for(let p of result.body) {
            let index = this.data.order.products.findIndex(item=>item.product_id == p._id && item.variant_id=='');
            if(index == -1) {
              let product = new Product(this.authService, this.utilService);
              product.loadDetails(p);              
              this.filteredProducts.push(product);
            }
          }
        }
      });  
  }
  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.selectedProducts);
  }

  displayFn(product: Product) {
    if (product) { 
      return product.data.name; 
    }
  }

  addProduct(product:Product): void {
    if (!product) {
      return;
    }
    if(product.data.variant_inv) {
      const dialogRef = this.dialog.open(VariantsDlgComponent, {
        width: '800px',
        data: {product: product}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.products) {        
          for(let p of result.products) {
            let cart_product = new CartProduct(p.product, p.variant_id);            
            this._addProduct(cart_product, p.qty);
          }
          this.dataSource = new MatTableDataSource(this.selectedProducts);
        }
      });
    } else {
      this._addProduct(new CartProduct(product));
      this.dataSource = new MatTableDataSource(this.selectedProducts);
    }
    this.form.get('selectedProduct').setValue('');    
  }

  _addProduct(product:CartProduct, qty:number=1) {
    let index = this.selectedProducts.findIndex(item => item.product_id == product.product_id && item.variant_id == product.variant_id);
    if(index>-1) {
      this.selectedProducts[index].qty += qty;
    } else {
      product.qty = qty;
      this.selectedProducts.push(product);
    }
  }

  deleteProduct(product:CartProduct) {
    let index = this.selectedProducts.findIndex(item => item.product_id == product.product_id && item.variant_id == product.variant_id);
    if(index > -1) {
      this.selectedProducts.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.selectedProducts);
    }
  }

  confirmPassword(cb?:any) {
    const dialogRef = this.dialog.open(PasswordDlgComponent, {
      width: '500px',
      data: {user: this.data.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 1) {
        this.data.passed_password = true;
        if(cb) cb();
      }
    });
  }

  inpurtQty(product:CartProduct) {
    if(product.qty > product.inventory) {
      product.qty = product.inventory;
    }
  }

  public get isValid() {
    for(let i=0;i<this.selectedProducts.length;i++) {
      if(this.selectedProducts[i].qty > 0) {
        return true;
      }
    }
    return false;
  }

  doAction(){
    if(this.form.valid) {            
      this.dialogRef.close({products: this.selectedProducts, passed_password: this.data.passed_password});
    }
  }
}
