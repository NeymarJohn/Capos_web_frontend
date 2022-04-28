import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@config/constant';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { AuthService } from '@app/_services/auth.service';
import { SaleDataSource } from '@app/_services/sale.datasource';

@Component({
  selector: 'app-quoted-sale',
  templateUrl: './quoted-sale.component.html',
  styleUrls: ['./quoted-sale.component.scss']
})
export class QuotedSaleComponent implements OnInit, AfterViewInit {  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;  
  searchForm: FormGroup;
  util = UtilFunc;  
  displayedColumns = ['created_at', 'receipt', 'customer', 'user_id', 'note', 'total', 'action'];
  sort = {
    sort_field: 'created_at',
    sort_order: -1
  };
  salesData:any=[];  
  user: any;
  customers:any = [];
  outlets:any = [];
  users:any = [];
  main_outlet = '';
  completed_status = Constants.completed_status;  
  dataSource: SaleDataSource;   

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private utilService: UtilService,
    private authService: AuthService
  ) {
    this.dataSource = new SaleDataSource(this.authService, this.utilService);

    this.authService.checkPremission('quoted');
    this.searchForm = this.fb.group({
      sale_number: [''],
      customer: [''],
      note: [''],
      outlet: [''],
      user_id: [''],
      start:[''],
      end:['']
    });
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
    filter.sale_status = 'quoted';
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
      note: '',
      outlet: '',
      user_id: '',
      start:'',
      end:''
    });
    this.search();
  }
  
  handleAction(element:any) {
    const action = 'new';
    this.route.navigate(['/dashboard/sell/selling'], {queryParams: {_id: element._id, action: action}});
  }

  onSort(event) {
    this.sort.sort_field = event.active;
    this.sort.sort_order = event.direction == 'desc'? -1: 1;    
    this.search();
  }
}
