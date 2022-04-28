import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UtilService } from '@app/_services/util.service';
import { Cart } from '@app/_classes/cart.class';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import {ConfirmDlgComponent} from '@layout/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-pay-account-dlg',
  templateUrl: './pay-account-dlg.component.html',
  styleUrls: ['./pay-account-dlg.component.scss']
})
export class PayAccountDlgComponent implements OnInit {

  util = UtilFunc;
  form: FormGroup;  
  types = ['Cash', 'Credit Card', 'Master Card', 'Store Credit'];
  sales:Cart[] = [];
  sale:Cart = null;
  statuses = {layby: 'LayBy', on_account: 'On Account'};

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PayAccountDlgComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog,
  ) { 
    this.sale = null;
    const filter = {outlet: data.outlet, customer: data.customer._id, sale_status: 'layby_account'};
    if(!data.outlet) delete filter.outlet;
    this.utilService.get('sale/sale', filter).subscribe(result => {
      if(result && result.body.length>0) {
        for(let c of result.body) {
          let sale = new Cart(this.authService, this.utilService);
          sale.loadByCart(c);
          this.sales.push(sale);
        }        
      } 
    })

    this.form = this.fb.group({  
      sale: [null, [Validators.required]],
      amountToPay:['', [Validators.required]],
      type: ['cash', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  selSale() {
    this.sale = this.saleInput.value;
    this.amountInput.setValue(this.sale.totalIncl);
    this.amountInput.setValidators([Validators.required, Validators.min(this.sale.totalIncl)]);
  }

  payBalance(): void {
    if(this.form.valid && this.isValidAmount) {
      const dialogRef = this.dialog.open(ConfirmDlgComponent, {
        width: '500px',
        data: {
          title: 'Confirm Payment', 
          msg: 'Are you sure to pay this account?',
          ok_button: 'OK',
          cancel_button: 'Cancel'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result == 'process') {        
          const result = {
            action: 'pay',
            sale: this.sale,
            pay_mode: this.typeInput.value,
            amount: this.amountInput.value
          }
          this.dialogRef.close(result);    
        } 
      });
    }
  }

  public get isValidAmount():boolean {
    if(this.typeInput.value == 'store_credit') {
      if(parseFloat(this.data.customer.data.credit) < this.amountInput.value) {
        return false;
      }
    }
    return true;
  }

  get saleInput(): any {return this.form.get('sale'); }
  get saleInputError(): string {
    if (this.saleInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get amountInput(): any {return this.form.get('amountToPay'); }
  get amountInputError(): string {
    if (this.amountInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.amountInput.hasError('min')) {return Constants.message.invalidMinValue.replace('?', this.sale.totalIncl.toString()); }    
  }

  get typeInput(): any {return this.form.get('type'); }
  get typeInputError(): string {
    if (this.typeInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
