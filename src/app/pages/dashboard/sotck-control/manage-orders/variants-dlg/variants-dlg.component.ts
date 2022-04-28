import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as UtilFunc from '@helper/util.helper';
import { Order } from '@app/_classes/order.class';
import { IOrderProduct } from '@app/_classes/order.class';
import { ToastService } from '@app/_services/toast.service';

interface IData {
  checked: boolean,
  product: IOrderProduct
}

@Component({
  selector: 'app-variants-dlg',
  templateUrl: './variants-dlg.component.html',
  styleUrls: ['./variants-dlg.component.scss']
})
export class VariantsDlgComponent implements OnInit {
  
  checked_all:boolean = false;
  table_data:IData[] = [];
  dataSource:any;
  util = UtilFunc;
  displayedColumns = ['checked', 'name', 'inventory', 'qty', 'supply_price', 'total'];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<VariantsDlgComponent>,
    private toastService: ToastService,
  ) {     
    
  }

  ngOnInit(): void {
    for(let p of this.data.product.data.variant_products) {
      this.table_data.push({
        checked: false,
        product: Order.getNewOrderProduct(this.data.product, p._id)
      })
    }   
    this.dataSource = new MatTableDataSource(this.table_data); 
  }

  getProductInventory(product:IOrderProduct) {
    if(!product.product.data.tracking_inv) {
      return '-';
    } else {
      return Order.getProductInventory(product);
    }
  }

  selProduct() {    
    let checked = true;
    for(let c of this.table_data) {
      if(!c.checked) {
        checked = false;
        break;
      }
    }
    this.checked_all = checked;
  }

  selProductAll() {
    for(let c of this.table_data) {
      c.checked = !this.checked_all;
    }
  }

  getProductTotal(product:IOrderProduct):string {
    let qty = product.qty;
    let total = parseFloat((qty * product.supply_price).toFixed(2));
    
    return this.util.getPriceWithCurrency(total);
  }

  public get isValid() {
    for(let c of this.table_data) {
      if(c.checked){
        return true;
      }
    }
    return false;
  }

  doAction(){
    let products:IOrderProduct[] = [];
    for(let data of this.table_data) {
      if(data.checked && data.product.qty > 0) {
        products.push(data.product);
      }
    }
    if(products.length == 0) {
      this.toastService.showFailed('Please choose at lease a variant.');
      return;
    }
    this.dialogRef.close({products: products});
  }
}
