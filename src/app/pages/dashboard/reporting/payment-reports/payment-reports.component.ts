import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Cart } from '@app/_classes/cart.class';

interface IData{
  date: string,  
  store_credit: number,
  cash: number,
  concealed_cash: number,
  credit: number,
  debit: number,
  refunds: number,
  voided: number,
  total: number
};


@Component({
  selector: 'app-payment-reports',
  templateUrl: './payment-reports.component.html',
  styleUrls: ['./payment-reports.component.scss']
})
export class PaymentReportsComponent implements OnInit {
  searchForm: FormGroup;
  salesData:Cart[] = [];
  returnsData:Cart[] = [];
  voidedData:Cart[] = [];
  openClose:any[] = [];
  cashData:any = [];
  table_data:IData[] = [];
  
  displayedColumns=['date', 'store_credit', 'concealed_cash', 'cash', 'credit', 'debit', 'refunds', 'voided', 'total'];
  user: any;  
  dataSource: any; 
  util = UtilFunc;
  dates = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
  ) {
    this.authService.checkPremission('payment_report');
    this.searchForm = this.fb.group({
      start:[''],
      end:['']
    });
   }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {        
      this.user = user;      
    });    
    this.search();
  }

  search(){
    this.table_data = [];
    const filter = this.searchForm.value;
    if(this.user.outlet) filter.outlet = this.user.outlet._id;
    this.utilService.get('sale/payments', filter).subscribe(result => {            
      if(result && result.body) {                
        let date = '', index = 0;
        for(let c of result.body.sales) {
          let cart = new Cart(this.authService, this.utilService);
          cart.loadByCart(c);
          date = this.util.handleDate(cart.created_at);
          index = this.dates.findIndex(item=>item==date);
          if(index==-1) this.dates.push(date);
          this.salesData.push(cart);
        }
        for(let r of result.body.returns) {
          let cart = new Cart(this.authService, this.utilService);
          cart.loadByCart(r);
          date = this.util.handleDate(cart.created_at);
          index = this.dates.findIndex(item=>item==date);
          if(index==-1) this.dates.push(date);
          this.returnsData.push(cart);
        }
        for(let v of result.body.voided) {
          let cart = new Cart(this.authService, this.utilService);
          cart.loadByCart(v);
          date = this.util.handleDate(cart.created_at);
          index = this.dates.findIndex(item=>item==date);
          if(index==-1) this.dates.push(date);
          this.voidedData.push(cart);
        }
        for(let o of result.body.openclose) {
          date = this.util.handleDate(o.created_at);
          index = this.dates.findIndex(item=>item==date);
          if(index==-1) this.dates.push(date);
          this.openClose.push(o);
        }
        for(let c of result.body.cash) {
          date = this.util.handleDate(c.created_at);
          index = this.dates.findIndex(item=>item==date);
          if(index==-1) this.dates.push(date);
          this.cashData.push(c);
        }        
        this.getTableData();
      }
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  getTableData() {
    for(let d of this.dates) {
      let sData = this.salesData.filter(item => this.util.handleDate(item.created_at) == d);
      let rData = this.returnsData.filter(item => this.util.handleDate(item.created_at) == d);
      let vData = this.voidedData.filter(item => this.util.handleDate(item.created_at) == d);
      let oData = this.openClose.filter(item => this.util.handleDate(item.created_at) == d);
      let cData = this.cashData.filter(item => this.util.handleDate(item.created_at) == d);
      let refunds = rData.reduce((a, b)=> a + b.totalIncl, 0);    
      let voided = -1 * vData.reduce((a, b)=> a + b.tax + parseFloat(b.totalExcl), 0);      
      let cash = sData.reduce((a, b)=>a + b.getReceivedPayments('cash'), 0);
      let store_credit = sData.reduce((a, b)=>a + b.getReceivedPayments('store_credit'), 0);
      let debit = sData.reduce((a, b)=>a + b.getReceivedPayments('debit'), 0);
      let credit = sData.reduce((a, b)=>a + b.getReceivedPayments('credit'), 0);      
      for(let p of sData) {            
          if(p.sale_status == 'on_account') {                
              credit += p.tax + parseFloat(p.totalExcl);
          }
      }
      let ccash = oData.reduce((a, b)=>a + b.open_value, 0);
      for(let c of cData) {
        if(c.is_credit == 1) {
          ccash += c.transaction;
        } else {
          ccash -= c.transaction;
        }
      }
      let data:IData = {
        date: d,
        cash: cash,
        store_credit: store_credit,
        debit: debit,
        refunds: refunds,
        voided: voided,
        credit: credit,
        concealed_cash: ccash,
        total: cash + credit + ccash + refunds + debit + store_credit + voided
      }
      this.table_data.push(data);
    }
  }


  toExcel(){
    
  }

  public get totalCash():string{
    let sum = this.table_data.reduce((a, b)=>a + b.cash, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalConceled(){
    let sum = this.table_data.reduce((a, b)=>a + b.concealed_cash, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalCreditCard(){
    let sum = this.table_data.reduce((a, b)=>a + b.credit, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalDebitCard(){
    let sum = this.table_data.reduce((a, b)=>a + b.debit, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalRefunds(){
    let sum = this.table_data.reduce((a, b)=>a + b.refunds, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalVoided(){
    let sum = this.table_data.reduce((a, b)=>a + b.voided, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalStoreCredit(){
    let sum = this.table_data.reduce((a, b)=>a + b.store_credit, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalTotal(){
    let sum = this.table_data.reduce((a, b)=>a + b.total, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  clearFilter() {
    this.searchForm.setValue({
      start:'',
      end:''
    });
    this.search();
  }

}
