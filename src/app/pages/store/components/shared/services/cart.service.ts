import { Injectable } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '@app/pages/store/modals/cart-item';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { ToastService } from '@app/_services/toast.service';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { AuthService } from '@app/_services/auth.service';
import { CartProduct } from '@app/_classes/cart_product.class';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem('cartItems')) || [];

@Injectable({
  providedIn: 'root'
})
export class CartService {

  util = UtilFunc;
  public cartItems  :  BehaviorSubject<CartProduct[]> = new BehaviorSubject([]);
  public cartProducts:CartProduct[] = [];

  constructor(
    private toastService: ToastService,
    private utilService: UtilService,
    private authService: AuthService
  ) {    
    this.cartItems.subscribe(
      products => this.cartProducts = products
    );
    this.initCartProducts();
  }

  public initCartProducts() {    
    let _ids = []; let _products:Product[] = [];
    for(let p of products)  _ids.push(p.product_id);    
    if(_ids.length>0) {      
      this.utilService.get('product/product', {range:'_ids', _ids: _ids.join(',')}).subscribe(result => {
        if(result && result.body) {
          for(let p of result.body) {
            let product = new Product(this.authService, this.utilService);
            product.loadDetails(p);
            _products.push(product);
          }
        }        
        for(let p of products) {
          let product = this.getProduct(_products, p);
          let stock = product.getInventory(p.variant_id);
          if(stock<p.qty) {
            let index = products.findIndex(item => item.product_id == p.product_id && item.variant_id == p.variant_id);
            products.splice(index, 1);
          } else {
            let cart_product = new CartProduct(product, p.variant_id);
            let index = this.cartProducts.findIndex(item => item.product_id == cart_product.product_id && item.variant_id == cart_product.variant_id);            
            if(index > -1) {
              this.cartProducts[index].qty += p.qty;
            } else {
              cart_product.qty = p.qty;
              this.cartProducts.push(cart_product);
            }
          }
        }
      })
    }
  }

  public getCartProducts(): Observable<CartProduct[]> {
    const itemsStream = new Observable(observer => {            
      observer.next(this.cartProducts);
      observer.complete();
    });
    return <Observable<CartProduct[]>>itemsStream;
  }

  private getProduct(products:Product[], cart:CartItem):Product {
    let index = products.findIndex(item => item._id == cart.product_id);
    if(index > -1) {
      return products[index];
    }
    return null;
  }

    // Get Carts
  public getItems(): Observable<CartItem[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
  }

   // Add to cart
  public addToCart(product: Product, quantity: number, variant_id:string='') {
    let message:string = product.data.name + ' has been added to cart.';
    let cartItem: CartItem = { 
      product_id: product._id, 
      qty: quantity, 
      variant_id: variant_id
    };

    let index = products.findIndex(item => item.product_id == product._id && item.variant_id == variant_id);
    if(index > -1) {
      let qty = products[index].qty + quantity;
      let stock = this.calculateStockCounts(product, variant_id, qty);
      if(qty != 0 && stock) {
        products[index]['qty'] = qty;        
        this.toastService.showSuccess(message);
      } else {
        message = 'Out of Stock';
        this.toastService.showWarning(message);
      }
    } else {
      products.push(cartItem);
      this.toastService.showSuccess(message);
    }    
    this._addToCartProducts(product, quantity, variant_id);
    localStorage.setItem('cartItems', JSON.stringify(products));
    return cartItem;
  }

  // Calculate Product stock Counts
  public calculateStockCounts(product: Product, variant_id:string, qty:number): CartItem | Boolean {    
    if(!product.data.tracking_inv) return true;
    const stock = product.getInventory(variant_id);
    if(qty > stock) {
      this.toastService.showFailed('You can not add more items than available. In stock '+ stock +' items.');
      return false;
    }    
    return true
  }

  private _addToCartProducts(product: Product, quantity: number, variant_id:string='') {
    let index = this.cartProducts.findIndex(item => item.product_id == product._id && item.variant_id == variant_id);
    if(index > -1) {
      this.cartProducts[index].qty += quantity;
    } else {
      let cart_product = new CartProduct(product, variant_id);
      cart_product.qty = quantity;
      this.cartProducts.push(cart_product);
    }
  }

  private _removeFromCartProducts(cartProduct:CartProduct) {
    let index = this.cartProducts.findIndex(item => item.product_id == cartProduct.product_id && item.variant_id == cartProduct.variant_id);
    this.cartProducts.splice(index, 1);
  }

  // Removed in cart
  public removeFromCart(cart_product: CartProduct) {
    if (cart_product === undefined) return false;
    const index = products.findIndex(item => item.product_id == cart_product.product_id && item.variant_id == cart_product.variant_id);
    if(index > -1) products.splice(index, 1);
    this._removeFromCartProducts(cart_product);
    localStorage.setItem('cartItems', JSON.stringify(products));
  }

  // Update Cart Value
  public updateCartQuantity(cartProduct: CartProduct, quantity: number) {
    let index = products.findIndex(item => item.product_id == cartProduct.product_id && item.variant_id == cartProduct.variant_id);
    if(index > -1) {
      let qty = products[index].qty + quantity;
      if(qty == 0) {
        this.removeFromCart(cartProduct);
      } else {
        let stock = this.calculateStockCounts(cartProduct.product, cartProduct.variant_id, qty);
        if(stock) {
          products[index]['qty'] = qty;
          localStorage.setItem('cartItems', JSON.stringify(products));
          index = this.cartProducts.findIndex(item => item.product_id == cartProduct.product_id && item.variant_id == cartProduct.variant_id);
          if(index > -1) {
            this.cartProducts[index].qty += quantity;
          }
        } else {        
          this.toastService.showWarning('Couldn\'t order more than stock');
        }
      }
    }
  }

  public clearCart(private_web_address:string) {    
    const filters = this.cartProducts.filter(item => item.product.data.private_web_address == private_web_address);
    for(let p of filters) {
      let index = this.cartProducts.findIndex(item => item.product_id == p.product_id && item.variant_id == p.variant_id);
      if(index>-1) this.cartProducts.splice(index, 1);
      index = products.findIndex(item => item.product_id == p.product_id && item.variant_id == p.variant_id);
      if(index > -1) products.splice(index, 1);
    }    
    localStorage.setItem('cartItems', JSON.stringify(products));
  }
}
