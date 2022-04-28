import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Onlineorder } from '@app/_classes/onlineorder.class';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  form: FormGroup;
  keyword='';
  table_data:Onlineorder[] = [];
  dataSource:any;
  order_status = Constants.order_status;
  payment_status = Constants.payment_status;
  displayedColumns=['reference', 'customer', 'total', 'payment', 'status', 'payment_status', 'action'];
  util = UtilFunc;

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      keyword: [''],
      status: [''],
      payment_status: [''],      
      customer: [''],
      date_from: [''],
      date_to: ['']
    })    
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    const query = this.form.value;
    this.table_data = [];
    this.utilService.get('sale/order', query).subscribe(result => {
      if(result && result.body) {
        for(let o of result.body) {          
          let order = new Onlineorder(this.authService, this.utilService);
          order.loadDetails(o);             
          this.table_data.push(order);
        }
      }
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.paginator = this.paginator;
    })
  }

  clearFilter() {
    Object.keys(this.form.value).forEach(key => {
      this.form.get(key).setValue('');
    })
    this.search();
  }

  handleAction(action:string, order:Onlineorder) {
    if(action == 'detail') {
      this.router.navigate(['/dashboard/ecommerce/order-detail'], {queryParams: {_id: order._id}});
    }
    if(action == 'delete') {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '400px',
        data: {action: 'delete', item: 'order'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'delete'){
          order.delete(() => {
            this.toastService.showSuccessRemove();
            this.search();
          });
        }
      });  
    }
  }

}
