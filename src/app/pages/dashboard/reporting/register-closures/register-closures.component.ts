import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Openclose } from '@app/_classes/openclose.class';

interface IData{
  _id: string,
  register: string,
  opening_time: string,
  closing_time: string,
  store_credit: number,
  cash_concealed: number,
  cash: number,
  credit: number,  
  debit: number,
  refunds: number,  
  voided: number,
  total: number
};

@Component({
  selector: 'app-register-closures',
  templateUrl: './register-closures.component.html',
  styleUrls: ['./register-closures.component.scss']
})
export class RegisterClosuresComponent implements OnInit {  
  searchForm: FormGroup;
  table_data:IData[] = [];
  dataSource: any; 
  registers:any = [];
  user:any;
  displayedColumns=['register', 'opening_time', 'closing_time', 'store_credit',  'cash_concealed',  'cash', 'credit', 
      'debit', 'refunds', 'voided', 'total'];
  util = UtilFunc;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {
    this.authService.checkPremission('regiser_closure');
    this.searchForm = this.fb.group({
      register: ['']
    });
   }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {        
      this.user = user; 
      const filter = this.user.outlet ? {outlet: this.user.outlet._id} : {};
      this.utilService.get('sell/register', filter).subscribe(result => {
        this.registers = result.body;
      });
    });    

    this.search();
  }

  search(){
    this.table_data = [];
    const filter = this.searchForm.value;
    if(this.user.outlet) filter.outlet = this.user.outlet._id;
    filter.status = 2;
    this.utilService.get('sell/openclose', filter).subscribe(result => {            
      if(result && result.body) {
        for(let s of result.body) {
          let openClose = new Openclose(this.authService, this.utilService);   
          openClose.loadDetails(s);                    
          this.table_data.push(this.getData(openClose));          
        }
        this.dataSource = new MatTableDataSource(this.table_data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }      
    })
  }

  getData(openClose:Openclose):IData {
    let data:IData = {      
      _id: openClose._id,
      register: openClose.register.name,
      opening_time: this.util.handleDate(openClose.opening_time) + '<div><small>' + this.util.handleTime(openClose.opening_time) + '</small></div>',
      closing_time: this.util.handleDate(openClose.closing_time) + '<div><small>' + this.util.handleTime(openClose.closing_time) + '</small></div>',
      store_credit: parseFloat(openClose.receivedStoreCredit),
      cash: parseFloat(openClose.receivedCash),
      cash_concealed: parseFloat(openClose.totalCashMovements),
      credit: parseFloat(openClose.receivedCreditCard),
      debit: parseFloat(openClose.receivedDebitCard),
      refunds: parseFloat(openClose.totalReturns),
      voided: parseFloat(openClose.totalVoided),
      total: parseFloat(openClose.totalExpected)
    }
    return data;
  }

  public get totalStoreCredit():string {
    let sum = this.table_data.reduce((a, b)=>a + b.store_credit, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalCash():string {
    let sum = this.table_data.reduce((a, b)=>a + b.cash, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalConcealedTotal():string {
    let sum = this.table_data.reduce((a, b)=>a + b.cash_concealed, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalCreditCard():string {
    let sum = this.table_data.reduce((a, b)=>a + b.credit, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalDebitCard():string {
    let sum = this.table_data.reduce((a, b)=>a + b.debit, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalRefunds():string {
    let sum = this.table_data.reduce((a, b)=>a + b.refunds, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalVoided():string {
    let sum = this.table_data.reduce((a, b)=>a + b.voided, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalTotal():string {
    let sum = this.table_data.reduce((a, b)=>a + b.total, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  openDetails(element:any) {
    this.router.navigate(['dashboard/reporting/closure-details'], {queryParams: {_id: element._id}});
  }

  clearFilter() {
    this.searchForm.setValue({
      register: ''
    });
    this.search();
  }
}
