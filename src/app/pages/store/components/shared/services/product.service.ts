import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { Product } from '@app/_classes/product.class';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import * as UtilFunc from '@app/_helpers/util.helper';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  util = UtilFunc;
  public compareProducts : Product[] = [];
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
            this.compareProducts.push(product);
          }
        }  
      })
    }
  }

  // Get  wishlist Products
  public getComapreProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(this.compareProducts);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
    const item = products.find(item => item._id === product._id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product) {
    let message: string;
    if (!this.hasProduct(product)) {      
      products.push({_id: product._id});
      this.compareProducts.push(product);      
      message = product.data.name + ' has been added to comparison list.';            
      localStorage.setItem("compareItem", JSON.stringify(products));
    } 
    this.toastService.showSuccess(message);
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) { return; }
    let index = products.findIndex(item => item._id == product._id);
    products.splice(index, 1);
    index = this.compareProducts.findIndex(item => item._id == product._id);
    this.compareProducts.splice(index, 1);
    localStorage.setItem("compareItem", JSON.stringify(products));
  }
}
