import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import { Customer } from '@app/_classes/customer.class';
import * as UtilFunc from '@helper/util.helper';
import { Product } from '@app/_classes/product.class';

interface IData{
  product: string,
  outlet: string,
  current_stock: number,
  stock_value:number,
  item_value: number,
  reorder_point: number,
  reorder_amount: number
}

@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss']
})
export class InventoryReportsComponent implements OnInit {
  keyword:string ='';
  table_data:IData[] = [];
  displayedColumns=['product', 'outlet', 'current_stock', 'item_value', 'stock_value', 'reorder_point', 'reorder_amount'];
  dataSource:any;
  util = UtilFunc;
  user:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {        
      this.user = user;      
    });    
    this.search();    
  }

  toExcel(){
    //TODO: export to excel
  }

  search(){
    const filter = {tracking_inv: true};
    this.utilService.get('product/product', filter).subscribe(result => {
      if(result && result.body) {
        for(let p of result.body) {
          let product = new Product(this.authService, this.utilService);
          product.loadDetails(p);
          this.table_data = this.table_data.concat(this.getData(product));
        }
      }
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  getData(product:Product):IData[] {    
    let result:IData[] = [];
    if(product.data.variant_inv) {
      for(let vp of product.data.variant_products) {
        let data:IData = {
          product: product.data.name + ' <small>' + vp.name + '</small>',
          outlet: product.data.outlet.name,
          current_stock: vp.inventory,                    
          item_value: vp.supply_price,
          stock_value: vp.inventory * vp.supply_price,
          reorder_point: vp.reorder_point,
          reorder_amount: vp.reorder_amount
        }          
        result.push(data);
      }
    } else {
      let data:IData = {
        product: product.data.name,
        outlet: product.data.outlet.name,
        current_stock: product.data.inventory,                    
        stock_value: product.data.inventory * product.data.supply_price,
        item_value: product.data.retail_price,
        reorder_point: product.data.reorder_point,
        reorder_amount: product.data.reorder_amount
      }          
      result.push(data);
    }    
    return result;
  }

  filter(): void {
    this.dataSource.filter = this.keyword.trim().toLowerCase();
  }

}
