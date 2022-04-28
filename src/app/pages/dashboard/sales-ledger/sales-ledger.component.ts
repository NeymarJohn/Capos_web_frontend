import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { Constants } from '@app/_configs/constant';
import { SaleDataSource } from '@app/_services/sale.datasource';

interface IData{
  date: string,
  time: string,
  user: string,
  register: string,
  receipt: string,
  customer: string,
  status: string,
  total: number,
  user_email:string,
  customer_email:string
};

@Component({
  selector: 'app-sales-ledger',
  templateUrl: './sales-ledger.component.html',
  styleUrls: ['./sales-ledger.component.scss']
})
export class SalesLedgerComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  statuses = [];
  salesData:any=[];
  table_data:IData[] = [];
  displayedColumns=['created_at', 'sale_number', 'user_id', 'register', 'customer', 'sale_status', 'total'];
  sort = {
    sort_field: 'created_at',
    sort_order: -1
  };
  user: any;
  customers:any = [];
  users:any = [];
  dataSource: SaleDataSource; 
  util = UtilFunc;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
  ) { 
    this.dataSource = new SaleDataSource(this.authService, this.utilService);

    this.authService.checkPremission('sales_ledger');
    this.searchForm = this.fb.group({
      customer: [''],
      sale_status: ['all_payments'],
      user_id: [''],
      start:[''],
      end:['']
    });

    this.statuses.push({value: 'all_payments', label: 'All Sales'});
    for(let s of Constants.sale_status) {
      if(Constants.paid_status.includes(s.value)) this.statuses.push(s);
    }
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {        
      this.user = user;      
    });    

    this.utilService.get('customers/customer').subscribe(result => {
      this.customers = result.body;
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

  public get totalSum():string {
    let sum = this.dataSource.totalSum;
    return this.util.getPriceWithCurrency(sum);
  }

  getStatusLabel(status:string) {
    let index = this.statuses.findIndex(item => item.value == status);
    if(index > -1) {
      return this.statuses[index].label;
    }
    return '-';
  }

  clearFilter() {
    this.searchForm.setValue({
      customer: '',
      sale_status: 'all_payments',
      user_id: '',
      start:'',
      end:''
    });
    this.search();
  }

  onSort(event) {
    this.sort.sort_field = event.active;
    this.sort.sort_order = event.direction == 'desc'? -1: 1;    
    this.search();
  }
}
