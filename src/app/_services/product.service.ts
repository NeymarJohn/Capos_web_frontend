import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '@app/_services/util.service';
import { Product } from '@app/_classes/product.class';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {    

    constructor(        
        private utilService: UtilService, 
        private authService: AuthService
    ) {

    }

    getFeaturedProducts(callback:Function) {
        let a = {featured: [], new_product: [], on_sale: [], hot_offer: []};
        this.utilService.get('product/product', {range: 'featured'}).subscribe(result => {
            if(result && result.body) {                
                for(let p of result.body) {
                    if(!this.utilService.private_web_address) this.utilService.private_web_address = p.private_web_address;
                    let product = new Product(this.authService, this.utilService);
                    product.loadDetails(p);
                    if(product.data.feature.featured) a.featured.push(product);
                    if(product.data.feature.new_product) a.new_product.push(product);
                    if(product.data.feature.on_sale) a.on_sale.push(product);
                    if(product.data.feature.hot_offer) a.hot_offer.push(product);
                }                
            }      
            callback(a);
        })
    }

    getTopSellingProducts(callback:Function) {
        let products:Product[] = [];        
        this.utilService.get('sale/order', {range: 'top_selling'}).subscribe(result => {
            if(result && result.body) {
                for(let p of result.body) {
                    if(!this.utilService.private_web_address) this.utilService.private_web_address = p.private_web_address;
                    let product = new Product(this.authService, this.utilService);
                    product.loadDetails(p);
                    products.push(product);
                }                
            }      
            callback(products);
        })
    }
}