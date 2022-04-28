import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { ProductService } from '../services/product.service';
import * as UtilFunc from '@app/_helpers/util.helper';
import { CartProduct } from '@app/_classes/cart_product.class';
import { Observable, of } from 'rxjs';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-shopping-widgets',
  templateUrl: './shopping-widgets.component.html',
  styleUrls: ['./shopping-widgets.component.sass']
})
export class ShoppingWidgetsComponent implements OnInit {

  util = UtilFunc;

  public sidenavMenuItems:Array<any>;  

  constructor(
    private cartService: CartService, 
    public productService: ProductService,
    private utilService: UtilService
  ) {
    
  }

  ngOnInit() {
    
  }

  public get cartProducts():CartProduct[] {
    const private_web_address = this.utilService.private_web_address;
    return this.cartService.cartProducts.filter(item => item.product.data.private_web_address == private_web_address);
  }

  public get total():string {    
    let sum = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public updateCurrency(curr) {
    // this.productService.currency = curr;
  }


  public removeItem(item: CartProduct) {
    this.cartService.removeFromCart(item);
  }

}
