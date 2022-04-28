import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {UtilService} from '@service/util.service';
import {AuthService} from '@service/auth.service';
import { ToastService } from '@service/toast.service';
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@config/constant';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { SaleDataSource } from '@app/_services/sale.datasource';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ConfirmDlgComponent} from '@layout/confirm-dlg/confirm-dlg.component';
import { Cart } from '@app/_classes/cart.class';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-process-return',
  templateUrl: './process-return.component.html',
  styleUrls: ['./process-return.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProcessReturnComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  util = UtilFunc;
  searchForm: FormGroup;
  displayedColumns = ['expand', 'created_at', 'sale_number', 'customer', 'user_id', 'note', 'total', 'sale_status', 'action'];
  sort = {
    sort_field: 'created_at',
    sort_order: -1
  };
  salesData:any=[];
  statuses = [];
  user: any;
  customers:any = [];
  outlets:any = [];
  users:any = [];
  allow_void_sales:boolean = false;
  allow_refund:boolean = false;
  main_outlet = '';
  completed_status = Constants.completed_status;  
  dataSource: SaleDataSource; 

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog

  ) {
    this.searchForm = this.fb.group({
      sale_number: [''],
      customer: [''],
      sale_status: ['all_closed'],
      note: [''],
      outlet: [''],
      user_id: [''],
      start:[''],
      end:['']
    });
    this.dataSource = new SaleDataSource(this.authService, this.utilService);
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.allow_void_sales = this.user.role.permissions.includes('void_sales');
        this.allow_refund = this.user.role.permissions.includes('refund');
      }
    });

    this.statuses.push({value: 'all_closed', label: 'All Closed Sales'});
    for(let s of Constants.sale_status) {
      if(Constants.completed_status.includes(s.value)) this.statuses.push(s);
    }
  }

  ngOnInit(): void {
    this.utilService.get('customers/customer').subscribe(result => {
      this.customers = result.body;
    });
    this.utilService.get('sell/outlet').subscribe(result => {
      this.outlets = result.body;
      for(let o of this.outlets) {
        if(o.is_main) {
          this.main_outlet = o.name;
          break;
        }
      }
    });
    this.utilService.get('auth/users').subscribe(result => {
      this.users = result.body;
    });
    this.search();
  }

  ngAfterViewInit() {
    this.paginator.page
      .subscribe(
        (value:PageEvent) => {
          this.search();
        }
      );
  }

  search(){
    const filter = this.searchForm.value;    
    let page = this.paginator.pageIndex, size = this.paginator.pageSize;
    if(typeof page =='undefined') page = 0;
		if(!size) size = 10;
    filter.sort_field = this.sort.sort_field;
    filter.sort_order = this.sort.sort_order;
    this.dataSource.loadCarts(filter, page, size);   
  }

  clearFilter() {
    this.searchForm.setValue({
      sale_number: '',
      customer: '',
      sale_status: 'all_closed',
      note: '',
      outlet: '',
      user_id: '',
      start:'',
      end:''
    });
    this.search();
  }

  handleAction(element:any) {
    if(!this.allow_refund){
      this.toastService.showWarning(Constants.message.notAllowedRefund);
      return;
    }
    const action = 'return';
    this.route.navigate(['/dashboard/sell/selling'], {queryParams: {_id: element._id, action: action}});
  }

  voidSale(sale: Cart) {
    if(!this.allow_void_sales) {
      this.toastService.showWarning(Constants.message.notAllowedVoidSale);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'You are about to void this sale.', 
        msg: 'This will return the products back into your inventory and remove any payments that were recorded. You’ll still be able to see the details of this sale once it has been voided. This can’t be undone.',
        ok_button: 'Void Sale',
        cancel_button: 'Don\'t Void'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        sale.voidSale(() => {
          this.toastService.showSuccess(Constants.message.successVoided);
          this.search();
        })
      } 
    });
  }

  voidItems(sale:Cart) {
    if(!this.allow_void_sales) {
      this.toastService.showWarning(Constants.message.notAllowedVoidSale);
      return;
    }
    this.route.navigate(['/dashboard/sell/selling'], {queryParams: {_id: sale._id, action: 'void'}});
  }
  
  onSort(event) {
    this.sort.sort_field = event.active;
    this.sort.sort_order = event.direction == 'desc'? -1: 1;    
    this.search();
  }
}
