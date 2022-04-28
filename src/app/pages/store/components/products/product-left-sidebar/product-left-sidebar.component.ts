import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductDataSource } from '@app/_services/product.datasource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UtilService } from '@app/_services/util.service';
import { AuthService } from '@app/_services/auth.service';
import { CategoriesComponent } from '@app/pages/store/components/widgets/categories/categories.component';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit, AfterViewInit {

  public sidenavOpen:boolean = true;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public sortByOrder:string = 'name=1';   // sorting
  price = {priceFrom:0, priceTo:0};
  brand:string = '';
  keyword:string = '';
  category_slug:string = '';
  category:string = '';
  productDatasource: ProductDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(CategoriesComponent) categories: CategoriesComponent;

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event){
    this.pageYoffset = window.pageYOffset;
  }

  constructor(    
    private route: ActivatedRoute,
    private utilService: UtilService,
    private authService: AuthService,
    private scroll: ViewportScroller
  ) {

    this.productDatasource = new ProductDataSource(this.authService, this.utilService);   
  }

  ngOnInit() {    
    this.route.params.subscribe((params: Params) => {      
      this.category_slug = params['category'];
      this.category = '';    
      this.searchProducts();            
    });    
  }

  ngAfterViewInit() {          
    this.paginator.page.subscribe(
        (value:PageEvent) => {
          this.searchProducts();
        }
    );         
  }

  public get page_title():string {
    let t = 'Shop / Categories / '; 
    if(this.categories && !this.category) {      
      let title = this.categories.getCategory(this.category_slug);
      if(title) {
        if(title == 'All') title = 'All Categories';      
        this.category = title;
        this.utilService.setDocTitle(title);
      }
    }
    if(this.category_slug == 'all') {
      return t + 'All';
    } else {
      let c = this.categories ? this.categories.getCategory(this.category_slug) : '';
      return t + c;
    }
  }

  searchProducts() {
    let category_slug = this.category_slug;
    if(category_slug == 'all') category_slug = '';
    let brand = this.brand;
    if(brand == 'all') brand = '';
    const sort = this.sortByOrder.split('=');
    let filter = {
      range: 'all-factor', 
      category_slug: category_slug, 
      brand: brand, 
      keyword: this.keyword, 
      priceFrom: this.price.priceFrom,
      priceTo: this.price.priceTo
    };
    let pageIndex = this.paginator? this.paginator.pageIndex: 0;
    let pageSize = this.paginator? this.paginator.pageSize: 30;    
    this.productDatasource.loadProducts(filter, pageIndex, pageSize, sort[0], parseInt(sort[1]));  
  }

  // sorting type ASC / DESC / A-Z / Z-A etc.
  public onChangeSorting(val:string) {
    this.sortByOrder = val;
    this.applyFilter();
  }
  
  applyFilter() {
    this.paginator.pageIndex = 0;    
    this.searchProducts();
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  clearKeyword() {
    this.keyword = '';
    this.applyFilter();
  }

  // Update price filter
  public updatePriceFilters(price: any) {
    this.price = price;    
    this.applyFilter();
  }

  onBrandsChanged(brand:string) {
    this.brand = brand;
    this.applyFilter();
  }
}
