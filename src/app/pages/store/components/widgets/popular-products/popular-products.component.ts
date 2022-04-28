import { Component, OnInit } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { ProductService } from '@app/_services/product.service';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-popular-products',
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.sass']
})
export class PopularProductsComponent implements OnInit {

  public products: Product[];
  public product: Product;
  util = UtilFunc;
 
  constructor(private productService: ProductService) { }
 
   ngOnInit() {
     this.productService.getTopSellingProducts(result => {
       this.products = result;
     })
   }
}
