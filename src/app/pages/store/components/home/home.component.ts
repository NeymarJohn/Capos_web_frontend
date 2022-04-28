import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '@app/_services/product.service';
import { Product } from '@app/_classes/product.class';
import { ProductCarouselComponent } from '@app/pages/store/components/products/product-carousel/product-carousel.component';
import { IBanner, IService, Store } from '@app/_classes/store.class';
import { StoreConstants } from '@app/_configs/constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  @ViewChild('latest_productsRef') latest_productsRef: ProductCarouselComponent;
  @ViewChild('on_sale_productsRef') on_sale_productsRef: ProductCarouselComponent;

  featured_products: Product[];
  new_products: Product[];
  on_sale_products: Product[];
  vertical_products:any;
  
  contentLoaded = false;
  public banners:IBanner[] = [];
  public sliders:IBanner[] = [];
  services:IService[] = [];

  constructor(private productService: ProductService, public store: Store) {
    this.store.load(() => {      
      if(this.store.active_widget.sliders) {
        if(this.store.sliders.length>0) {
          this.sliders = this.store.sliders;
        } else {
          this.sliders = StoreConstants.default_sliders;
        }
      }
      if(this.store.active_widget.banners) {
        if(this.store.banners.length>0) {
          this.banners = this.store.banners;
        } else {
          this.banners = StoreConstants.default_banners;
        }
      }
      if(this.store.active_widget.services) {
        if(this.store.services.length>0) {
          this.services = this.store.services;
        } else {
          this.services = StoreConstants.default_services;
        }
      }
    })
  }

  ngOnInit() {    

    this.productService.getFeaturedProducts(result => {      
      this.vertical_products = result;
      this.featured_products = result.featured;
      this.new_products = result.new_product;
      this.on_sale_products = result.on_sale;    
      this.contentLoaded = true;
    });

    // setTimeout(() => {
    //   this.contentLoaded = true;
    // }, 3000);
  }

  changeTab(event) {
    if(event.index == 1) this.latest_productsRef.updateSwiper();
    if(event.index == 2) this.on_sale_productsRef.updateSwiper();
  }






}
