import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import {ToastService} from '@app/_services/toast.service';
import {MatTableDataSource} from '@angular/material/table';
import {AttributeDlgComponent} from './attribute-dlg/attribute-dlg.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  columnToDisplay = ['name' , 'description', 'products', 'action'];
  columnToSpecify = ['products', 'action'];
  dataSource: any;
  user: any;
  attributes = [];
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
        this.permission = this.user.role.permissions.includes('create_product_attribute');
      }
    });
  }

  ngOnInit(): void {
    this.initAttributeTable();
  }

  initAttributeTable(): void {
    this.utilService.get('product/attribute', {}).subscribe(result => {
      this.attributes = result.body;
      this.dataSource = new MatTableDataSource(this.attributes);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  searchAttribute(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  viewProducts(element: any): void {
    this.route.navigate(['/dashboard/product'], {queryParams: {property: 'attribute', value: element._id}});
  }

  addAttribute(): void {
    const dialogRef = this.dialog.open(AttributeDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: {name: '', description: ''}, action: 'add', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        this.initAttributeTable();
      }
    });
  }

  editAttribute(item): void {
    const dialogRef = this.dialog.open(AttributeDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: item, action: 'edit', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initAttributeTable();
      }
    });
  }

  deleteAttribute(item){    
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {        
        action: 'delete',
        item: 'Product Attribute'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        const url = 'product/attribute?_id=' + item._id;
        this.utilService.delete(url).subscribe((res) => {
          if(res.body && res.body.status == 'product_contains') {
            this.toastService.showWarning(Constants.message.product_contains);
          } else {
            this.initAttributeTable();
            this.toastService.showSuccessRemove();
          }
        }, err => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

}
