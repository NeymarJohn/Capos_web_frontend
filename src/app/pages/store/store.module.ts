import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainCarouselComponent } from './components/main-carousel/main-carousel.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { PriceComponent } from './components/products/price/price.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ProductDialogComponent } from './components/products/product-dialog/product-dialog.component';
import { ProductLeftSidebarComponent } from './components/products/product-left-sidebar/product-left-sidebar.component';
import { BrandsComponent } from './components/widgets/brands/brands.component';
import { CategoriesComponent } from './components/widgets/categories/categories.component';
import { PopularProductsComponent } from './components/widgets/popular-products/popular-products.component';
import { ProductZoomComponent } from './components/products/product-details/product-zoom/product-zoom.component';
import { ProductVerticalComponent } from './components/products/product-vertical/product-vertical.component';
import { ProductCarouselComponent } from './components/products/product-carousel/product-carousel.component';
import { ProductCarouselThreeComponent } from './components/products/product-carousel-three/product-carousel-three.component';

import { SharedModule } from './components/shared/shared.module';
import { ShareModule } from '@shared/share.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ColorOptionsComponent } from './components/color-options/color-options.component';
import { StoreRoutingModule } from './store-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CartComponent } from './components/pages/cart/cart.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { CompareComponent } from './components/pages/compare/compare.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { MyAccountComponent } from './components/pages/my-account/my-account.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { OrderSuccessComponent } from './components/pages/order-success/order-success.component';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { BlogDetailsComponent } from './components/blog/blog-details/blog-details.component';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    MainCarouselComponent,
    ColorOptionsComponent,
    PriceComponent, 
    ProductsComponent, 
    ProductComponent, 
    ProductDetailsComponent, 
    ProductDialogComponent, 
    ProductLeftSidebarComponent,
    BrandsComponent, 
    CategoriesComponent, 
    PopularProductsComponent, 
    ProductZoomComponent, 
    ProductVerticalComponent,
    ProductCarouselComponent,
    ProductCarouselThreeComponent,
    CartComponent,
    ContactComponent,
    WishlistComponent,
    CheckoutComponent,
    CompareComponent,
    MyAccountComponent,
    AboutUsComponent,
    FaqComponent,
    OrderSuccessComponent,
    BlogDetailsComponent,
    BlogListComponent
  ],
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    SharedModule,
    ShareModule,
    SwiperModule,
    NgxSkeletonLoaderModule,        
    NgxImgZoomModule,
    StoreRoutingModule,    
    NgxPaginationModule,
    //BrowserAnimationsModule
  ],
})
export class StoreModule { }
