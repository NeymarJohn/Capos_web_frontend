import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '@app/_services/toast.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {TypeDlgComponent} from './type-dlg/type-dlg.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';
import {Producttype} from '@app/_classes/producttype.class';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {

  columnToDisplay = ['name', 'description', 'products', 'touch', 'cigarette','revenue', 'action'];
  columnToSpecify = ['products', 'touch', 'cigarette', 'revenue', 'action'];
  dataSource: any;
  user: any;
  types:Producttype[] = [];
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
        this.permission = this.user.role.permissions.includes('create_product_type');
      }
    });
  }

  ngOnInit(): void {
    this.initTypeTable();
  }

  initTypeTable(): void {
    this.types = [];
    this.utilService.get('product/type', {}).subscribe(result => {
      for(let t of result.body) {
        let type = new Producttype(this.authService, this.utilService);
        type.loadDetails(t);
        this.types.push(type)
      }      
      this.dataSource = new MatTableDataSource(this.types);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  addType(type?:Producttype): void {
    if(!type) {
      type = new Producttype(this.authService, this.utilService);
    }
    const dialogRef = this.dialog.open(TypeDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {type: type}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        this.initTypeTable();
      }
    });
  }

  searchType(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  viewProducts(type: Producttype): void {
    this.route.navigate(['/dashboard/product'], {queryParams: {property: 'type', value: type._id}});
  }

  toggleTouch(event, type:Producttype): void {
    event.stopPropagation();
    type.data.touch = !type.data.touch;
    type.save(() => {
      this.toastService.showSuccessSave();
    })    
  }

  cigaretteTouch(event, type:Producttype): void {
    event.stopPropagation();
    type.data.cigarette = !type.data.cigarette;
    type.save(() => {
      this.toastService.showSuccessSave();
    })    
  }

  revenueTouch(event, type:Producttype): void {
    event.stopPropagation();
    type.data.revenue = !type.data.revenue;
    type.save(() => {
      this.toastService.showSuccessSave();
    })    
  }
  deleteType(type: Producttype){
    const warning_msg = (type.data.products > 0) ? type.data.products + ' product(s) contain this type.':'';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        warning_msg: warning_msg,
        action: 'delete',
        item: 'Product Type'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        type.delete(() => {
          this.initTypeTable();
          this.toastService.showSuccessRemove();
        }, () => {
          this.toastService.showFailedRemove();
        })
      }
    });
  }

}
