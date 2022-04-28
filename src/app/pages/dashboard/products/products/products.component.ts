import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@service/auth.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ExportToCsv} from 'export-to-csv';
import {MatDialog} from '@angular/material/dialog';
import {RemoveItemDlgComponent} from '../remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Product } from '@app/_classes/product.class';
import { ProductDataSource } from '@app/_services/product.datasource';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProductsComponent implements OnInit {  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;  
  
  productSearchForm: FormGroup;
  util = UtilFunc;
  user: any;
  products:Product[] = [];
  dataSource: ProductDataSource;
  columnsToDisplay = ['expand', 'name', 'type', 'barcode', 'retail_price', 'inventory', 'enabled', 'touch', 'created_at', 'action'];
  columnsToLabel = {expand: '', name: 'Name', type:'Category', barcode: 'Barcode', inventory: 'Inventory', retail_price:'Retail Price', 
      enabled:'Active', created_at:'Created', touch: 'Touch', action:''};
  columnsToSpecify = ['expand','name', 'type', 'retail_price', 'inventory', 'enabled', 'touch', 'created_at', 'action'];
  expandedElement: any | null;
  types = [];
  tags = [];
  suppliers = [];
  brands = [];
  attributes = [];
  sort = {
    sort_field: 'name',
    sort_order: 1
  };
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Candidate Long List',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    filename: 'Capos products'
  };
  private property = '';
  private value = '';
  permission:boolean = false;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService,
    private route: Router,
    private router: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.dataSource = new ProductDataSource(this.authService, this.utilService);
    this.router.queryParams.subscribe(data => {
      if (data) {
        const {property, value} = data;
        this.property = property;
        this.value = value;
      }
    });

    this.productSearchForm = this.fb.group({
      keyword: [''],
      type: [this.getDefaultFilterValue('type')],
      tag: [this.getDefaultFilterValue('tag')],
      supplier: [this.getDefaultFilterValue('supplier')],
      brand: [this.getDefaultFilterValue('brand')],
      attribute: [this.getDefaultFilterValue('attribute')],
      enabled: ['']
    });

    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('create_products');
      }
    });
  }

  getDefaultFilterValue(mode:string) {    
    return this.property==mode ? this.value : '';
  }

  ngOnInit(): void {
    // Search form    
    this.utilService.get('product/type', {}).subscribe(result => {
      this.types = result.body;
    });
    
    this.utilService.get('product/tag', {}).subscribe(result => {
      this.tags = result.body;
    });

    this.utilService.get('product/supplier', {}).subscribe(result => {
      this.suppliers = result.body;
    });

    this.utilService.get('product/brand', {}).subscribe(result => {
      this.brands = result.body;
    });

    this.utilService.get('product/attribute', {}).subscribe(result => {
      this.attributes = result.body;
    });
    
    this.searchProduct();
  }

  ngAfterViewInit() {
    this.paginator.page
      .subscribe(
        (value:PageEvent) => {
          this.searchProduct();
        }
      );
  }

  import(): void {
    this.route.navigate(['/dashboard/product/product-import']);
  }

  handleAction(action:string, product?: Product): void {
    if (action === 'add') {
      this.route.navigate(['/dashboard/product/product-add'], {queryParams: {action: 'add'}});
    } else if (action === 'read') {
      this.route.navigate(['/dashboard/product/product-detail'], {queryParams: {_id: product._id}});
    } else if (action === 'edit') {
      if(!this.permission){
        this.toastService.showWarning('You have no permission to edit product.');
        return;
      }
      this.route.navigate(['/dashboard/product/product-add'], {queryParams: {_id: product._id, action: 'edit'}});
    } else if (action === 'delete') {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '600px',
        height: 'auto',
        data: {action: 'delete', item: 'product'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action) {
          product.delete(() => {
            this.toastService.showSuccessRemove();
            this.searchProduct()
          }, () => {
            this.toastService.showFailedRemove();
          })
        }
      });
    }
  }

  exportList(): void {
    const productList = this.products.map(product => {      
      delete product._id;
      delete product.data.variant_products;
      return product;
    });
    const exportToCsv = new ExportToCsv(this.options);
    exportToCsv.generateCsv(productList);
  }

  searchProduct(): void {
    const filter = this.productSearchForm.value;    
    filter.range = 'all-factor';    
    let page = this.paginator.pageIndex, size = this.paginator.pageSize;
    if(typeof page =='undefined') page = 0;
		if(!size) size = 10;    
    this.dataSource.loadProducts(filter, page, size, this.sort.sort_field, this.sort.sort_order);    
  }

  toggleStatus(product:Product): void {
    product.save(() => {
      this.toastService.showSuccessSave();
    })    
  }

  clearFilter(): void {    
    this.productSearchForm = this.fb.group({
      keyword: [''],
      type: [''],
      tag: [''],
      supplier: [''],
      brand: [''],
      attribute: [''],
      enabled: ['']
    });
    this.searchProduct();
  }

}
