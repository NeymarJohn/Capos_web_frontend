import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@config/constant';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-fulfillments',
  templateUrl: './fulfillments.component.html',
  styleUrls: ['./fulfillments.component.scss']
})
export class FulfillmentsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchForm: FormGroup;
  util = UtilFunc;  
  displayedColumns = ['created_at', 'customer', 'soldBy', 'note', 'soldTotal', 'status', 'action'];
  statuses = [
    {value: 'all_fulfillments', label: 'All Sales'},    
    {value: 'delivery_unfulfilled', label: 'Delivery,unfulfilled'},
    {value: 'pickup_unfulfilled', label: 'Pickup,unfulfilled'}
  ];
  salesData:any=[];  
  user: any;
  customers:any = [];
  outlets:any = [];
  users:any = [];
  main_outlet = '';
  completed_status = Constants.completed_status;  
  dataSource: any; 

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private utilService: UtilService
  ) {
    this.searchForm = this.fb.group({
      sale_number: [''],
      customer: [''],
      sale_status: ['all_fulfillments'],
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

  search(){
    const filter = this.searchForm.value;
    filter.sale_status = 'quoted';
    this.utilService.get('sale/sale', filter).subscribe(result => {
      this.salesData = result.body;
      this.dataSource = new MatTableDataSource(this.salesData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  clearFilter() {
    this.searchForm.setValue({
      sale_number: '',
      sale_status: 'all_fulfillments',
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

}
