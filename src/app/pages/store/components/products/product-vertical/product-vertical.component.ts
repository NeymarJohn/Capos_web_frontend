import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ProductService } from '@app/_services/product.service';
import { Product } from '@app/_classes/product.class';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-product-vertical',
  templateUrl: './product-vertical.component.html',
  styleUrls: ['./product-vertical.component.sass']
})
export class ProductVerticalComponent implements OnInit, AfterViewInit {
  util = UtilFunc;
  contentLoaded = false;
  @Input('product') product:{
    featured: Array<Product>,
    hot_offer: Array<Product>
  };  
  top_selling_products:Product[] = [];  

  constructor(private productService: ProductService ) {
    
  }

  ngOnInit() {    
    this.productService.getTopSellingProducts(result => {
      this.top_selling_products = result;      
    })

    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

  ngAfterViewInit() {
    
  }

}
