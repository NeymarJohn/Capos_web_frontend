import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import * as UtilFunc from '@helper/util.helper';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

interface IData{
  date: string,  
  total: number,
  revenue: number,
  cost_of_goods: number,
  gross_profit: number,
  margin: number,
  tax: number
};

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesReportsComponent implements OnInit {
  searchForm: FormGroup;
  salesData:any=[];
  table_data:IData[] = [];
  displayedColumns=['date', 'total', 'revenue', 'cost_of_goods', 'gross_profit', 'margin', 'tax'];  
  user: any;  
  dataSource: any; 
  util = UtilFunc;
  dates = [];
  only_own_sales:boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
  ) { 
    this.authService.checkPremission('sales_report');    
    this.searchForm = this.fb.group({
      start:[''],
      end:['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {        
      this.user = user; 
      if(user.role && user.role.name != 'Admin') {
        this.only_own_sales = user.role.permissions.includes('only_own_sales');
      }
    });    
    this.search();
  }

  search(){
    this.table_data = [];
    const filter = this.searchForm.value;
    if(this.user.outlet) filter.outlet = this.user.outlet._id;
    if(this.only_own_sales) {
      filter.user_id = this.user._id;
    }
    this.utilService.get('sale/sale', filter).subscribe(result => {            
      if(result && result.body) {
        for(let s of result.body) {
          s.date = this.util.handleDate(s.created_at);
          let index = this.dates.findIndex(item=>item==s.date);
          if(index==-1) this.dates.push(s.date);
          this.salesData.push(s);
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
      let sData = this.salesData.filter(item => item.date == d);
      let total = sData.reduce((a, b)=>a + b.total, 0);
      let revenue = sData.reduce((a, b)=>a + b.subtotal, 0);
      let tax = sData.reduce((a, b) => a + b.tax, 0);
      let cog = 0, margin = 0;
      for(let sd of sData) {
        for(let p of sd.products){
          if(p.variant_id !== '') {
            let v_index = p.product_id.variant_products.findIndex(item => item._id == p.variant_id);
            if(v_index > -1) {
              cog += p.product_id.variant_products[v_index].supply_price * p.qty;              
            }
          } else {
            cog += p.product_id.supply_price * p.qty;
            margin += p.product_id.margin;
          }
        }
      }
      let data:IData = {
        date: d,
        total:total,
        revenue: revenue,
        cost_of_goods: cog,
        gross_profit: revenue - cog,
        margin: (revenue - cog)/cog * 100,
        tax: tax
      }
      this.table_data.push(data);
    }
  }

  public get totalTotal(){
    let sum = this.table_data.reduce((a, b)=>a + b.total, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalRevenue(){
    let sum = this.table_data.reduce((a, b)=>a + b.revenue, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalCost(){
    let sum = this.table_data.reduce((a, b)=>a + b.cost_of_goods, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalProfit(){
    let sum = this.table_data.reduce((a, b)=>a + b.gross_profit, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalMargin(){    
    let sum = 0;
    let total_revenue = this.table_data.reduce((a, b)=>a + b.revenue, 0);
    let total_costs = this.table_data.reduce((a, b)=>a + b.cost_of_goods, 0);
    if(total_costs>0) sum = (total_revenue - total_costs) / total_costs * 100;    
    return sum.toFixed(2) + '%';
  }

  public get totalTax(){
    let sum = this.table_data.reduce((a, b)=>a + b.tax, 0);
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
