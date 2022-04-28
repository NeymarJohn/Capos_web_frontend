import { Component, OnInit } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.sass']
})
export class CompareComponent implements OnInit {

  util = UtilFunc;  

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private utilService: UtilService
  ) {

  }

  ngOnInit() {
    
  }

  public get products():Product[] {
    const private_web_address = this.utilService.private_web_address;
    return this.productService.compareProducts.filter(item => item.data.private_web_address == private_web_address);
  }

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
    this.cartService.addToCart(product, quantity);
  }

  // Remove from compare list
  public removeItem(product: Product) {
    this.productService.removeFromCompare(product);
  }
}
