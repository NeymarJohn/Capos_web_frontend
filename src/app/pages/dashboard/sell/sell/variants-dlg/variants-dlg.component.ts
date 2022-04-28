import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PriceDlgComponent } from '../price-dlg/price-dlg.component';
import * as UtilFunc from '@helper/util.helper';
import { CartProduct } from '@app/_classes/cart_product.class';

@Component({
  selector: 'app-variants-dlg',
  templateUrl: './variants-dlg.component.html',
  styleUrls: ['./variants-dlg.component.scss']
})
export class VariantsDlgComponent implements OnInit {

  cart_products:CartProduct[] = [];
  util = UtilFunc;
  form: FormGroup;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VariantsDlgComponent>,
    private fb: FormBuilder
  ) {     

    let form_control = {}; let index = 0;
    for(let cp of data.cart_products) {            
      if(!cp.tracking_inv) {
        form_control['qty' + index] = [0];
      } else {
        form_control['qty' + index] = [0, [Validators.max(cp.inventory_virtual)]];
      }
      form_control['checked' + index] = [false];
      index++;
    }
    this.form = this.fb.group(form_control);
  }

  ngOnInit(): void {
  }

  selProduct(index:number) {    
    let checked = this.form.get('checked' + index).value;
    let cart_product:CartProduct = this.data.cart_products[index];
    if(checked) {
      let data = {price: '', weight:'', blank_cup_weight: 0}, f = false;      
      if(!cart_product.price && cart_product.product.data.price_prompt && !cart_product.product.data.has_no_price) {
        f = true;
      } else {
        delete data.price;
      }
      if(!cart_product.weight && cart_product.product.data.scale_product) {
        data.blank_cup_weight = cart_product.product.data.blank_cup_weight;
        f = true;
      } else {
        delete data.blank_cup_weight;
        delete data.weight;
      }

      if(f) {
        const dlgRef = this.dialog.open(PriceDlgComponent, {
          width: '400px',
          data: data
        });
        dlgRef.afterClosed().subscribe(result => {
          if(result && result.action == 'process' && result.data) {
            if(result.data.prompt_price) cart_product.prompt_price = result.data.prompt_price;
            if(result.data.weight) cart_product.weight = result.data.weight;
            this.form.get('qty' + index).setValue(1);
          } else {
            this.form.get('checked' + index).setValue(false);
          }
        });
      } else {
        this.form.get('qty' + index).setValue(1);
      }
    } else {      
      this.form.get('qty' + index).setValue(0);
    }
  }

  public get isValid() {
    for(let i=0;i<this.data.cart_products.length;i++) {
      if(this.form.get('checked' + i).value && this.form.get('qty' + i).value>0) {
        return true;
      }
    }
    return false;
  }

  public inventory_str(product:any):string {
    if(!product.tracking_inv) {
      return '-';
    } else {
      if(product.inventory_virtual == 0) {
        return 'Out of Stock';
      } else {
        return product.inventory_virtual.toString();
      }
    }
  }

  public isInStock(product:any):boolean {
    if(!product.tracking_inv) {
      return true;
    } else {
      return product.inventory_virtual > 0;
    }
  }

  getError(index:number) {
    return 'This value must be less than ' + this.data.cart_products[index].inventory_virtual;
  }

  doAction(){
    if(this.form.valid) {
      let sel_products = [];
      for(let i=0;i<this.data.cart_products.length;i++) {
        let qty = this.form.get('qty' + i).value;
        let checked = this.form.get('checked' + i).value;
        if(checked && qty>0) {
          sel_products.push({
            variant_id: this.data.cart_products[i].variant_id,
            prompt_price: this.data.cart_products[i].prompt_price,
            weight: this.data.cart_products[i].weight,
            qty: qty
          })
        }
      }
      this.dialogRef.close({sel_products: sel_products});
    }
  }
}
