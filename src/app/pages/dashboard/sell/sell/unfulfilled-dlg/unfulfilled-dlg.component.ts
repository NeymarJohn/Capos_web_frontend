import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-unfulfilled-dlg',
  templateUrl: './unfulfilled-dlg.component.html',
  styleUrls: ['./unfulfilled-dlg.component.scss']
})
export class UnfulfilledDlgComponent implements OnInit {
  form: FormGroup;
  step:number = 0;
  titles:string[] = ['Choose how this order will be fulfilled.', 'Contact info for the delivery.', 'Add shipping details for this sale.'];
  descriptions:string[] = ['Inventory will be reserved for all items in the sale.', 'Enter details to contact the customer about this order.',
                      'Record the delivery address in the sale note.'];
  fulfillment = {
    mode: 'delivery',
    customer: null,
    email: '',
    phone: '',
    mobile: '',
    fax: ''
  };

  contact_number_mode:String = 'mobile';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<UnfulfilledDlgComponent>,
    private fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      email:['', [Validators.email]]     
    });    
  }

  ngOnInit(): void {
  }

  gotoStep2(){    
    if(this.form.valid) {
      this.step = 2;
    }
  }

  doAction() {
    this.data.cart.fulfillment = {
      mode: this.fulfillment.mode,
      customer: this.fulfillment.customer._id,
      email: this.form.get('email').value,
      mobile: this.fulfillment.mobile,
      phone: this.fulfillment.phone,
      fax: this.fulfillment.fax      
    };    
    this.dialogRef.close('process');
  }

  selCustomer() {
    if(!this.fulfillment.customer) {
      return;
    }
    this.form.get('email').setValue(this.fulfillment.customer.data.email);
    this.fulfillment.mobile = this.fulfillment.customer.data.mobile;
    this.fulfillment.phone = this.fulfillment.customer.data.phone;
    this.fulfillment.fax = this.fulfillment.customer.data.fax;
    this.contact_number_mode = 'mobile';
  }

  getContactInfo() {
    let result = '';
    if(this.fulfillment.customer) {
      if(this.fulfillment.customer.data.mobile) {
        result = this.fulfillment.customer.data.mobile;
      } else if(this.fulfillment.customer.data.phone) {
        result = this.fulfillment.customer.data.phone;
      } else if(this.fulfillment.customer.data.fax) {
        result = this.fulfillment.customer.data.fax;
      }
    }
    return result;
  }

  resetCustomer() {
    this.fulfillment.customer = null;
    this.form.get('email').setValue('');
    this.fulfillment.mobile = '';
    this.fulfillment.phone = '';
    this.fulfillment.fax = '';
  }

  checkContact() {
    let email = this.form.get('email').value;
    return email || this.fulfillment.mobile || this.fulfillment.phone || this.fulfillment.fax;
  }

  exit() {
    this.dialogRef.close();
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {    
    if (this.emailInput.hasError('email')) {return Constants.message.validEmail; }    
  }
}
