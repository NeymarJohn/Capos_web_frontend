import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductDialogComponent } from '../../products/product-dialog/product-dialog.component';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { ProductService } from '@app/pages/store/components/shared/services/product.service';
import { WishlistService } from '@app/pages/store/components/shared/services/wishlist.service';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.sass']
})
export class ProductCarouselComponent implements OnInit {
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();  
  @Input('product') product: Array<Product> = [];
  public config: SwiperConfigInterface = {};  
  contentLoaded = false;
  util = UtilFunc;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;

  constructor(private dialog: MatDialog, 
    private router: Router, 
    private cartService: CartService, 
    private productService: ProductService, 
    private wishlistService: WishlistService) {
    
  }

  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

  ngAfterViewInit(){ 
    this.config = {
      observer: true,
      slidesPerView: 5,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      }
    }
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
    this.productService.addToCompare(product);  
  }

  updateSwiper() {
    if(this.product.length > 0) {
      this.directiveRef.update();
    }
  }
}