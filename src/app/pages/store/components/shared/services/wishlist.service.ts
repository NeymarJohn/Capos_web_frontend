import { Injectable } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import * as UtilFunc from '@app/_helpers/util.helper';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("wishlistItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  util = UtilFunc;
  // wishlist array
  public wishlistProducts: Product[] = [];
  public observer   :  Subscriber<{}>;  

  constructor(
    private authService: AuthService, 
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.initProducts();
  }

  public initProducts() {    
    let _ids = []; 
    for(let p of products)  _ids.push(p._id);    
    if(_ids.length>0) {      
      this.utilService.get('product/product', {range:'_ids', _ids: _ids.join(',')}).subscribe(result => {
        if(result && result.body) {
          for(let p of result.body) {
            let product = new Product(this.authService, this.utilService);
            product.loadDetails(p);            
            this.wishlistProducts.push(product);
          }
        }  
      })
    }
  }

  // Get  wishlist Products
  public getProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(this.wishlistProducts);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

   // If item is aleready added In wishlist
  public hasProduct(product: Product): boolean {
    const item = products.find(item => item._id === product._id);
    return item !== undefined;
  }

   // Add to wishlist
  public addToWishlist(product: Product) {
    let message: string;
    if (!this.hasProduct(product)) {      
      products.push({_id: product._id});
      this.wishlistProducts.push(product);      
      message = product.data.name + ' has been added to wishlist.';            
      localStorage.setItem("wishlistItem", JSON.stringify(products));
    } 
    this.toastService.showSuccess(message);
  }

  // Removed Product
  public removeFromWishlist(product: Product) {
    if (product === undefined) { return; }
    let index = products.findIndex(item => item._id == product._id);
    products.splice(index, 1);
    index = this.wishlistProducts.findIndex(item => item._id == product._id);
    this.wishlistProducts.splice(index, 1);
    localStorage.setItem("wishlistItem", JSON.stringify(products));
  }

  public clearAll() {
    const private_web_address = this.utilService.private_web_address;
    const filters = this.wishlistProducts.filter(item => item.data.private_web_address == private_web_address);
    for(let p of filters) {
      let index = this.wishlistProducts.findIndex(item => item._id == p._id);
      if(index > -1) this.wishlistProducts.splice(index, 1);
      index = products.findIndex(item => item._id == p._id);
      if(index > -1) products.splice(index, 1);
    }
    localStorage.setItem("wishlistItem", JSON.stringify(products));
  }
}
