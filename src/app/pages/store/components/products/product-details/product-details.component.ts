import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/_classes/product.class';
import { UtilService } from '@app/_services/util.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '@app/pages/store/components/shared/services/cart.service';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';
import { Location } from '@angular/common';
import { AuthService } from '@app/_services/auth.service';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass']
})
export class ProductDetailsComponent implements OnInit {

  public config: SwiperConfigInterface={};
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();

  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;

  public image: any;
  public zoomImage: any;

  public counter:number = 1;
  public related_products:Product[] = [];
  public attributes = [];
  public variants = [];  

  index: number;
  bigProductImageIndex = 0;
  contentLoaded:boolean = false;
  util = UtilFunc;  

  constructor(
    private route: ActivatedRoute, 
    private utilService: UtilService, 
    private authService: AuthService,  
    private toastService: ToastService,
    public dialog: MatDialog, 
    private router: Router, 
    private cartService: CartService,
    public product: Product
  ) {
    this.utilService.get('product/attribute').subscribe(result => {
      this.attributes = result.body;
    })     
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.variants = []; this.related_products = [];
      this.utilService.get('product/product', {range:'_id', _id: id}).subscribe(result => {
        if(result && result.body) {
          this.product.loadDetails(result.body);
          if(this.product.data.variant_inv && this.product.data.variants.length>0) {
            for(let i=0;i<this.product.data.variants.length;i++) {
              this.variants.push('-1');
            }
          }
          this.getRelatedProducts();
          this.util.scrollToTop();
          this.utilService.setDocTitle(this.product.data.name);
        } else {
          this.toastService.showFailed(Constants.message.noExistingProduct);
          this.router.navigate(this.util.getRouterLink());
        }
      })
    });
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 3,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 3,
        },
      }
    }
  }

  getAttribute(_id: string) {
    let index = this.attributes.findIndex(item => item._id == _id);
    if(index > -1) {
      return this.attributes[index].name;
    }
    return '';
  }

  public get isOrderable():boolean {
    let result = this.product.inStock;    
    if(this.product.data.variant_inv && this.product.data.variants.length > 0) {      
      for(let p of this.variants) {
        result = result && p!='-1';        
      }
      if(result) {        
        result = result && this.product.getInVariantStock(this.attribute_pair);
      }
    } 
    return result;
  }

  public get attribute_pair() {
    let pair = [];
    for(let p of this.variants) {        
      if(p != '-1') pair.push(p);
    }
    return pair;
  }

  public get variant_id():string {
    let vp = this.product.getVariantProductByPair(this.attribute_pair);
    if(vp) {
      return vp._id;
    }
    return '';
  }

  public get price():string {
    if(this.product.data.variant_inv && this.product.data.variant_products.length>0) {
      if(this.variant_id) {
        return this.util.getPriceWithCurrency(this.product.getPrice(this.variant_id));
      }
      return '';
    }
    return this.product.retail_price;
  }

  public openProductDialog(product, bigProductImageIndex) {
    let dialogRef = this.dialog.open(ProductZoomComponent, {
      data: {product, index: bigProductImageIndex },
      panelClass: 'product-dialog',
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

  public selectImage(index) {    
    this.bigProductImageIndex = index;
  }

  public get inventory() {
    if(!this.product.data.variant_inv) {
      return this.product.data.inventory;
    } else {
      let vp = this.product.getVariantProductByPair(this.attribute_pair);
      if(vp) return vp.inventory;
    }
    return 0;
  }

  public increment() {    
    if(this.product.data.tracking_inv && this.inventory<=this.counter)  {
      this.toastService.showWarning('Couldn\'t order more than stock');
      return;
    }
    this.counter += 1;
  }

  public decrement() {
    if(this.counter >1){
      this.counter -= 1;
    }
  }

  public getRelatedProducts(){
    if(this.product.data.type) {
      this.utilService.get('product/product', {type: this.product.data.type._id}).subscribe(result => {
        if(result && result.body) {
          for(let p of result.body) {
            if(p._id != this.product._id) {
              let product = new Product(this.authService, this.utilService);
              product.loadDetails(p);            
              this.related_products.push(product);
            }
          }
        }
        this.contentLoaded = true;
      });
    }    
  }

  // Add to cart
  public addToCart(product: Product) {
    if (this.counter == 0) return false;
    this.cartService.addToCart(product, this.counter, this.variant_id);
  }

   // Add to cart
   public buyNow(product: Product) {
    if (this.counter == 0) return false;
    this.cartService.addToCart(product, this.counter, this.variant_id);
    this.router.navigate(this.util.getRouterLink('/checkout'));
  }

  public onMouseMove(e){
    if(window.innerWidth >= 1280){
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX/image.offsetWidth*100;
      y = offsetY/image.offsetHeight*100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if(zoomer){
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event){
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer(){
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }
}


