import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Location} from '@angular/common';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '@app/_services/toast.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  columnToDisplay = ['name' , 'description', 'markup', 'products', 'action'];
  columnToSpecify = ['products', 'markup', 'action'];
  dataSource: any;
  user: any;
  suppliers = [];
  searchVal: string;  
  util = UtilFunc;
  permission:boolean = false;

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private location: Location,
    private utilService: UtilService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private route: Router,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('create_supplier');
      }
    });
  }

  ngOnInit(): void {
    this.initSupplierTable();
  }

  initSupplierTable(): void {
    this.utilService.get('product/supplier', {}).subscribe(result => {
      this.suppliers = result.body;      
      this.dataSource = new MatTableDataSource(this.suppliers);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  handleAction(action, element: any = {}): void {
    if (action === 'add') {
      this.route.navigate(['/dashboard/product/supplier-action'], {queryParams: {mode: 'add'}});
    } else {
      this.route.navigate(['/dashboard/product/supplier-action'], {queryParams: {mode: 'edit', id: element._id}});
    }
  }

  searchSupplier(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  viewProducts(element: any): void {
    this.route.navigate(['/dashboard/product'], {queryParams: {property: 'supplier', value: element._id}});
  }

  deleteSupplier(element){
    const warning_msg = (element.products > 0) ? element.products + ' product(s) contain this supplier.':'';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        warning_msg: warning_msg,
        action: 'delete',
        item: 'Supplier'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        const url = 'product/supplier?_id=' + element._id;
        this.utilService.delete(url).subscribe((res) => {
          this.initSupplierTable();
          this.toastService.showSuccessRemove();
        }, err => {
          this.toastService.showFailedRemove();
        });
      }
    });
  }

}
