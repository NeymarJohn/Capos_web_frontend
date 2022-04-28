import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as UtilFunc from '@helper/util.helper';
import { IVariantProduct } from '@app/_classes/product.class';

@Component({
  selector: 'app-variants-dlg',
  templateUrl: './variants-dlg.component.html',
  styleUrls: ['./variants-dlg.component.scss']
})
export class VariantsDlgComponent implements OnInit {

  variants:IVariantProduct[] = [];
  util = UtilFunc;
  form: FormGroup;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,    
    private dialogRef: MatDialogRef<VariantsDlgComponent>,
    private fb: FormBuilder
  ) {     
    let form_control = {};
    for(let index=0;index<data.variant_products.length;index++) {
      form_control['checked' + index] = [false];
    }
    this.form = this.fb.group(form_control);
  }

  ngOnInit(): void {
  }

  selVariant(index:number) {    
    let checked = this.form.get('checked' + index).value;    
    if(checked) {
      for(let i=0;i<this.data.variant_products.length;i++) {
        if(i!=index) {
          this.form.get('checked' + i).setValue(false);
        }
      }
    }
  }

  public get isValid() {
    for(let i=0;i<this.data.variant_products.length;i++) {
      if(this.form.get('checked' + i).value) {
        return true;
      }
    }
    return false;
  }

  doAction(){
    if(this.form.valid) {
      let variant:IVariantProduct;
      for(let i=0;i<this.data.variant_products.length;i++) {
        let checked = this.form.get('checked' + i).value;
        if(checked) {
          variant = this.data.variant_products[i];
          break;
        }
      }
      this.dialogRef.close({variant_id: variant._id});
    }
  }
}
