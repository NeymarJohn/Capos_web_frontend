import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import { Customer } from '@app/_classes/customer.class';
import * as UtilFunc from '@helper/util.helper';

interface IData{
  name: string,
  email: string,
  issued: number,
  redeemed:number,
  credit: number,
  issued_str: string,
  redeemed_str:string,
  credit_str: string
}

@Component({
  selector: 'app-store-credit-reports',
  templateUrl: './store-credit-reports.component.html',
  styleUrls: ['./store-credit-reports.component.scss']
})
export class StoreCreditReportsComponent implements OnInit, AfterViewInit {
  keyword='';
  table_data:IData[] = [];
  displayedColumns=['name', 'email', 'issued', 'redeemed', 'credit'];
  dataSource:any;
  util = UtilFunc;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.utilService.get('customers/customer',{}).subscribe(result => {
      if(result && result.body) {
        for(let c of result.body) {
          let customer = new Customer(this.authService, this.utilService);
          customer.loadDetails(c);          
          this.table_data.push(this.getData(customer));
        }
        this.dataSource = new MatTableDataSource(this.table_data);        
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  ngAfterViewInit() {
    
  }

  getData(customer:Customer):IData {
    let data:IData = {
      name: customer.data.name,
      email: customer.data.email,
      issued: customer.data.total_issued,
      redeemed: customer.data.total_redeemed,
      credit: customer.data.credit,
      issued_str: customer.total_issued_str,
      redeemed_str: customer.total_redeemed_str,
      credit_str: customer.credit_str
    }
    return data;
  }

  public get totalIssued(): string {
    let sum = this.table_data.reduce((a, b)=>a + b.issued, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalRedeemed(): string {
    let sum = this.table_data.reduce((a, b)=>a + b.redeemed, 0);
    return this.util.getPriceWithCurrency(sum);
  }

  public get totalCredit(){
    let sum = this.table_data.reduce((a, b)=>a + b.credit, 0);
    return this.util.getPriceWithCurrency(sum);
  }
  
  filter(): void {
    this.dataSource.filter = this.keyword.trim().toLowerCase();
  }
}
