import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import * as UtilFunctions from '@helper/util.helper';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '@service/toast.service';
import { Order } from '@app/_classes/order.class';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  lessFilter = true;
  table_data:Order[] = [];
  dataSource: any;
  columnsToDisplay = ['type', 'number', 'from', 'to', 'status', 'items', 'cost', 'created', 'action'];
  searchForm: FormGroup;  
  orderTypes = ['purchase', 'return', 'receive'];
  util = UtilFunctions;
  keyword: string;
  suppliers = [];
  outlets = [];
  
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
  ) {
    this.authService.checkPremission('manage_order');
    this.searchForm = this.fb.group({
      type: [''],
      outlet: [''],
      supplier: [''],
      date_from: [''],
      date_to: [''],
      due_from: [''],
      due_to: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser;    
    this.utilService.get('product/supplier', {}).subscribe(result => {
      this.suppliers = result.body;
    });
    this.utilService.get('sell/outlet', {}).subscribe(result => {
      this.outlets = result.body;
    });
    this.searchOrders();
  }

  filterOrder(): void {
    this.dataSource.filter = this.keyword.trim().toLowerCase();
  }

  orderStock() {
    this.route.navigate(['/dashboard/stock-control/order-stock']);
  }

  receiveStock() {
    this.route.navigate(['/dashboard/stock-control/receive-stock']);
  }

  returnStock() {
    this.route.navigate(['/dashboard/stock-control/return-stock']);
  }


  handleAction(order: Order, action: string): void {
    if (action === 'Edit') {
      if (order.data.type === 'purchase') {
        this.route.navigate(['/dashboard/stock-control/order-stock'], {queryParams: {_id: order._id}});
      } else if(order.data.type == 'receive') {
        this.route.navigate(['/dashboard/stock-control/receive-stock'], {queryParams: {_id: order._id}});
      }
    } else if (action === 'Read') {
      this.route.navigate(['/dashboard/stock-control/order-detail'], {queryParams: { _id: order._id}});
    }
  }

  removeOrder(order: Order): void {
    const data = {item: 'Purchase Order', action: 'remove'};
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '500px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action) {
        order.delete(() => {
          this.toastService.showSuccessRemove();
          this.searchOrders();
        }, (error) => {
          this.toastService.showFailedSave();
        })
      }
    });
  }

  searchOrders(): void {
    const query = this.searchForm.value;
    query.field = 'all-factor';    
    this.table_data = [];
    this.utilService.get('product/order', query).subscribe(result => {
      if(result && result.body) {
        for(let o of result.body) {
          let order = new Order(this.authService, this.utilService);
          order.loadDetails(o);
          this.table_data.push(order);
        }
      }
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.paginator = this.paginator;
    });
  }

  clearFilter() {
    this.keyword = '';
    this.searchForm.get('type').setValue('');
    this.searchForm.get('outlet').setValue('');
    this.searchForm.get('supplier').setValue('');
    this.searchForm.get('date_from').setValue('');
    this.searchForm.get('date_to').setValue('');
    this.searchForm.get('due_from').setValue('');
    this.searchForm.get('due_to').setValue('');
    this.searchOrders();
  }

  public get totalItems():number {
    return this.table_data.reduce((a, b) => a + b.items, 0)
  }

  public get totalCost():string {
    let sum = this.table_data.reduce((a, b) => a + b.total, 0);
    return this.util.getPriceWithCurrency(sum);
  }

}
