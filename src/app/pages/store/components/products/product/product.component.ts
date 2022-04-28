import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { ProductService } from '@app/pages/store/components/shared/services/product.service';
import { WishlistService } from '@app/pages/store/components/shared/services/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from '@app/_classes/product.class';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {

  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Input() product: Product;
  util = UtilFunc;
  contentLoaded: boolean = false;

  constructor(
    private cartService: CartService, 
    public productsService: ProductService, 
    private wishlistService: WishlistService, 
    private dialog: MatDialog, 
    private router: Router 
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);
  }

    // Add to cart
  public addToCart(product: Product,  quantity: number = 1) {
    if(product.data.variant_inv && product.data.variant_products.length>0) {
      this.openProductDialog(product);
    } else {
      this.cartService.addToCart(product, quantity);
    }
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

    // Add to compare
  public addToCompare(product: Product) {
    this.productsService.addToCompare(product);
  }

  public openProductDialog(product){
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

}
