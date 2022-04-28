import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { IPaymentButton } from '@app/_classes/payment.class';

@Component({
  selector: 'app-more-payment-dlg',
  templateUrl: './more-payment-dlg.component.html',
  styleUrls: ['./more-payment-dlg.component.scss']
})
export class MorePaymentDlgComponent implements OnInit {

  payment_buttons:IPaymentButton[][] = [];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<MorePaymentDlgComponent>,
  ) {     
    let i = 0;
    let p_buttons:IPaymentButton[] = [];      
    for(let p of data.payment_buttons) {
      if(i<4) p_buttons.push(p);
      i++;
      if(i==4) {
        i = 0;
        this.payment_buttons.push([...p_buttons]);
        p_buttons = [];
      }
    }
    if(i<4) {
      for(let j=i;j<4;j++) {
        p_buttons.push({
          code: '',
          label: ''
        });
      }
      this.payment_buttons.push([...p_buttons]);
    }
  }

  ngOnInit(): void {
    
  }

  doAction(code: string){
    this.dialogRef.close({pay_mode: code});
  }
}
