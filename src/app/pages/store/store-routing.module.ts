import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ProductLeftSidebarComponent } from './components/products/product-left-sidebar/product-left-sidebar.component';
import { ErrorPageComponent } from '@app/pages/error/error-page.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { CompareComponent } from './components/pages/compare/compare.component';
import { MyAccountComponent } from './components/pages/my-account/my-account.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { OrderSuccessComponent } from './components/pages/order-success/order-success.component';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { BlogDetailsComponent } from './components/blog/blog-details/blog-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [      
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      { path: 'products/:category', component: ProductLeftSidebarComponent },
      { path: 'product/:id', component: ProductDetailsComponent },      
      { path: 'cart', component: CartComponent, data: {title: 'Cart'} },
      { path: 'about', component: AboutUsComponent, data: {title: 'About Us'} },
      { path: 'checkout', component: CheckoutComponent, data: {title: 'Checkout'} },
      { path: 'faq', component: FaqComponent, data: {title: 'FAQ'} },
      { path: 'contact', component: ContactComponent, data: {title: 'Contact Us'} },
      { path: 'wishlist', component: WishlistComponent, data: {title: 'Wishlist'} },
      { path: 'compare', component: CompareComponent, data: {title: 'Compare'} },
      { path: 'my-account', component: MyAccountComponent },
      { path: 'order-success/:id', component: OrderSuccessComponent, data: {title: 'Order Success'} },
      { path: 'blog-list', component: BlogListComponent, data: {title: 'Blog'}},
      { path: 'blog-details', component: BlogDetailsComponent},      
      { path: '404', component: ErrorPageComponent, data: {title: '404'}},
      {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreRoutingModule { }
