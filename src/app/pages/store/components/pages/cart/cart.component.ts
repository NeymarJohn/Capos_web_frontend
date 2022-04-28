import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { CartProduct } from '@app/_classes/cart_product.class';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Store } from '@app/_classes/store.class';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {

  util = UtilFunc;  
  store_info:Store;
  default_tax = 'outlet';
  default_tax_rate = 0;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private cartService: CartService
  ) {
    this.store_info = new Store(this.authService, this.utilService);
    this.store_info.load(() => {      
      this.default_tax = this.store_info.default_tax;
    });
    this.utilService.get('sell/outlet', {is_main: true}).subscribe(result => {
      if(result && result.body) {
        let outlet = result.body[0];        
        this.default_tax_rate = outlet.defaultTax.rate;
      }
    })
  }

  ngOnInit() {    
  }
  
  public get cartProducts():CartProduct[] {
    const private_web_address = this.utilService.private_web_address;
    return this.cartService.cartProducts.filter(item => item.product.data.private_web_address == private_web_address);
  }

  public getTaxAmount(item:CartProduct):string {
    if(this.default_tax == 'product') {
      return item.taxAmount;
    } else {
      let sum = item.totalPrice * this.default_tax_rate / 100;
      if(sum>0) {
        return this.util.getPriceWithCurrency(sum);
      } else {
        return 'Free';
      }
    }
  }

  public get total():string {
    let sum = 0;
    if(this.default_tax == 'product') {
      sum = this.cartProducts.reduce((a, b)=> a + b.totalInclTax, 0);
    } else {
      let subtotal = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);  
      sum = subtotal * (1 + this.default_tax_rate/100);
    }
    return this.util.getPriceWithCurrency(sum);    
  }

  public get subTotal():string {
    let sum = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalTax():string {    
    let sum = 0;
    if(this.default_tax == 'product') {
      sum = this.cartProducts.reduce((a, b)=> a + b.totalTaxAmount, 0);
    } else {
       if(this.default_tax_rate>0) {
        let subtotal = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);
        sum = subtotal * (this.default_tax_rate/100);
       } else {
         return 'Free';
       }
    }    
    return this.util.getPriceWithCurrency(sum);    
  }

  public get taxRate_str():string {
    if(this.default_tax == 'outlet') {      
      return '(+' + this.default_tax_rate.toFixed(2) + '%)';
    }
    return '';
  }

  public removeItem(item: CartProduct) {
    this.cartService.removeFromCart(item);
  }

  // Increase Product Quantity
  public increment(product: CartProduct, qty:number = 1) {
    this.cartService.updateCartQuantity(product, qty);    
  }

  // Decrease Product Quantity
  public decrement(product:CartProduct, qty: number = -1) {
    this.cartService.updateCartQuantity(product, qty);
  }
}
