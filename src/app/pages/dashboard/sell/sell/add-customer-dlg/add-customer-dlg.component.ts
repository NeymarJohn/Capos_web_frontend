import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';
import { Customer } from '@app/_classes/customer.class';

@Component({
  selector: 'app-add-customer-dlg',
  templateUrl: './add-customer-dlg.component.html',
  styles: [
  ]
})
export class AddCustomerDlgComponent implements OnInit {

  addedCustomer:Customer = null;  

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddCustomerDlgComponent>,
  ) { 
    
  }

  ngOnInit(): void {
  }

  doAction(){
    if(!this.addedCustomer) return;
    this.dialogRef.close({customer: this.addedCustomer});
  }

  resetCustomer() {
    this.addedCustomer = null;
  }

  exit() {
    this.dialogRef.close();
  }
}
