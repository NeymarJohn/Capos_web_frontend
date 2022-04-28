import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import {ToastService} from '@app/_services/toast.service';
import {MatTableDataSource} from '@angular/material/table';
import {BrandDlgComponent} from './brand-dlg/brand-dlg.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  columnToDisplay = ['name' , 'description', 'products', 'action'];
  columnToSpecify = ['products', 'action'];
  dataSource: any;
  user: any;
  brands = [];
  searchVal: string;  
  util = UtilFunc;
  permission:boolean = false;

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private route: Router,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('create_brand');
      }
    });
  }

  ngOnInit(): void {
    this.initBrandTable();
  }

  initBrandTable(): void {
    this.utilService.get('product/brand', {}).subscribe(result => {
      this.brands = result.body;
      this.dataSource = new MatTableDataSource(this.brands);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  searchBrand(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  viewProducts(element: any): void {
    this.route.navigate(['/dashboard/product'], {queryParams: {property: 'brand', value: element._id}});
  }

  addBrand(): void {
    const dialogRef = this.dialog.open(BrandDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: {name: '', description: ''}, action: 'add', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        this.initBrandTable();
      }
    });
  }

  editBrand(item): void {
    const dialogRef = this.dialog.open(BrandDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: item, action: 'edit', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initBrandTable();
      }
    });
  }

  deleteBrand(item){
    const warning_msg = (item.products > 0) ? item.products + ' product(s) contain this brand.':'';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        warning_msg: warning_msg,
        action: 'delete',
        item: 'Product Brand'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        const url = 'product/brand?_id=' + item._id;
        this.utilService.delete(url).subscribe((res) => {
          this.initBrandTable();
          this.toastService.showSuccessRemove();
        }, err => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

}
