import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { ProductService } from '@app/pages/store/components/shared/services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '@app/_classes/product.class';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { Router } from '@angular/router';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.sass']
})
export class ProductDialogComponent implements OnInit, AfterViewInit {

  public counter            :   number = 1;
  public variantImage       :   any = '';
  public selectedColor      :   any = '';
  public selectedSize       :   any = '';
  public attributes = [];
  public variants = [];  
  util = UtilFunc;

  constructor(
    private router: Router, 
    private utilService: UtilService,
    private toastService: ToastService,
    public productsService: ProductService, 
    private cartService: CartService, 
    public dialogRef: MatDialogRef<ProductDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public product: Product) {

      this.utilService.get('product/attribute').subscribe(result => {
        this.attributes = result.body;
      })    
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if(this.product.data.variant_inv && this.product.data.variants.length>0) {
        for(let i=0;i<this.product.data.variants.length;i++) {
          this.variants.push('-1');
        }
      }
    })
  }

  getAttribute(_id: string) {
    let index = this.attributes.findIndex(item => item._id == _id);
    if(index > -1) {
      return this.attributes[index].name;
    }
    return '';
  }

  public get isOrderable():boolean {
    let result = this.product.inStock;    
    if(this.product.data.variant_inv && this.product.data.variants.length > 0) {      
      for(let p of this.variants) {
        result = result && p!='-1';        
      }
      if(result) {        
        result = result && this.product.getInVariantStock(this.attribute_pair);
      }
    } 
    return result;
  }

  public get attribute_pair() {
    let pair = [];
    for(let p of this.variants) {        
      if(p != '-1') pair.push(p);
    }
    return pair;
  }

  public get variant_id():string {
    let vp = this.product.getVariantProductByPair(this.attribute_pair);
    if(vp) {
      return vp._id;
    }
    return '';
  }

  public get price():string {
    if(this.product.data.variant_inv && this.product.data.variant_products.length>0) {
      if(this.variant_id) {
        return this.util.getPriceWithCurrency(this.product.getPrice(this.variant_id));
      }
      return '';
    }
    return this.product.retail_price;
  }

  public get inventory() {
    if(!this.product.data.variant_inv) {
      return this.product.data.inventory;
    } else {
      let vp = this.product.getVariantProductByPair(this.attribute_pair);
      if(vp) return vp.inventory;
    }
    return 0;
  }

  public addToCart(product: Product) {
    if (this.counter == 0) return false;
    this.cartService.addToCart(product, this.counter, this.variant_id);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public increment() {    
    if(this.product.data.tracking_inv && this.inventory<=this.counter)  {
      this.toastService.showWarning('Couldn\'t order more than stock');
      return;
    }
    this.counter += 1;
  }

  public decrement() {
    if(this.counter >1){
      this.counter -= 1;
    }
  }

  // Add to cart
  public buyNow() {
    if (this.counter == 0) return false;
    this.cartService.addToCart(this.product, this.counter, this.variant_id);
    this.router.navigate(this.util.getRouterLink('/checkout'));
    this.close();
  }
}
