import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import { Product } from '@app/_classes/product.class';
import { Constants } from '@app/_configs/constant';
import {Location} from '@angular/common';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  
  variants = [];  
  util = UtilFunc;
  
  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
    private utilService: UtilService,
    private toastService: ToastService,
    public product: Product
  ) {
    this.product.init();    
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(query => {      
      this.product.loadById(query._id, () => {

      }, () => {
        this.toastService.showFailed(Constants.message.noExistingProduct);
        this.goBack();
      });
    });
  }

  openTag(tag): void {
    this.route.navigate(['/dashboard/product/products'], {queryParams: {property: 'tag', value: tag}});
  }

  genImageUrl(url: string) {
    return this.utilService.get_image(url);
  }

  goBack(): void {
    this.location.back();
  }
}
