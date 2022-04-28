import { Component, OnInit } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.sass']
})
export class WishlistComponent implements OnInit {
  
  util = UtilFunc;

  constructor(
    private cartService: CartService, 
    private wishlistService: WishlistService,
    private utilService: UtilService
  ) {
    
  }

  ngOnInit() {
  }

  public get wishlistItems():Product[] {
    const private_web_address = this.utilService.private_web_address;
    return this.wishlistService.wishlistProducts.filter(item => item.data.private_web_address == private_web_address);
  }

   // Add to cart
  public addToCart(product: Product,  quantity: number = 1) {
    if (quantity > 0)
      this.cartService.addToCart(product, quantity);
    this.wishlistService.removeFromWishlist(product);
  }

  // Remove from wishlist
  public removeItem(product: Product) {
    this.wishlistService.removeFromWishlist(product);
  }

  public clearAll() {
    this.wishlistService.clearAll();
  }

}
