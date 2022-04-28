import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-price-dlg',
  templateUrl: './price-dlg.component.html',
  styles: [
  ]
})
export class PriceDlgComponent implements OnInit {

  form: FormGroup;
  mode: string = 'Add';
  msg: string = '';
  is_price: boolean = false;
  is_weight: boolean = false;
  is_serial: boolean = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PriceDlgComponent>,
    private fb: FormBuilder,
  ) { 
    let group = {prompt_price: null, weight: null, serial: null};
    if(typeof data.price != 'undefined') {
      if(data.price) this.mode = 'Change';
      this.msg = 'price';
      group.prompt_price = [data.price, [Validators.required, Validators.min(1)]];
      this.is_price = true;
    } else {
      delete group.prompt_price;
    }
    if(typeof data.weight != 'undefined') {
      group.weight = [data.weight, [Validators.required, Validators.min(0)]];
      if(data.weight) this.mode = 'Change';
      if(this.msg) this.msg += ' & ';
      this.msg += 'weight';
      this.is_weight = true;
    } else {
      delete group.weight;
    }
    if(typeof data.serial != 'undefined') {
      group.serial = [data.serial, [Validators.required]];
      if(data.serial) this.mode = 'Change';
      if(this.msg) this.msg += ' & ';
      this.msg += 'product serial';
      this.is_serial = true;
    }
    this.form = this.fb.group(group);             
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){    
      const data = this.form.value;         
      this.dialogRef.close({action: 'process', data: data});
    }
  }

  get priceInput(): any {return this.form.get('prompt_price'); }
  get priceInputError(): string {
    if(this.priceInput) {
      if (this.priceInput.hasError('required')) {return Constants.message.requiredField; }    
      if (this.priceInput.hasError('min')) {return Constants.message.invalidMinValue.replace('?', '1'); }    
    }
  }

  get weightInput(): any {return this.form.get('weight'); }
  get weightInputError(): string {
    if(this.weightInput) {
      if (this.weightInput.hasError('required')) {return Constants.message.requiredField; }    
      if (this.weightInput.hasError('min')) {return Constants.message.invalidMinValue.replace('?', '0'); }
    }
  }

  get serialInput(): any {return this.form.get('serial'); }
  get serialInputError(): string {
    if(this.serialInput) {
      if (this.serialInput.hasError('required')) {return Constants.message.requiredField; }          
    }
  }
}
