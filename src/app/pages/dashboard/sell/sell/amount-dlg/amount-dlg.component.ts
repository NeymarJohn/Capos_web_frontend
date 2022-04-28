import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-amount-dlg',
  templateUrl: './amount-dlg.component.html',
  styleUrls: ['./amount-dlg.component.scss']
})
export class AmountDlgComponent implements OnInit {

  util = UtilFunc;
  amount:string = '';
  total_amount_to_pay:number = 0;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,    
    private dialogRef: MatDialogRef<AmountDlgComponent>,
  ) { 
    this.amount = data.total_amount_to_pay;
    this.total_amount_to_pay = data.total_amount_to_pay;
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  enterNum(str) {    
    if(str == '.') {
     if(!this.amount.toString().includes('.')) this.amount += '.';
    } else {
      this.amount += str;
    }
  }

  backspace() {
    let len = this.amount.length;
    if(len > 0) {
      this.amount = this.amount.toString().substring(0, len-1);
    }
  }

  clear() {
    this.amount = '';
  }

  doAction(){
    if(this.amount) {
      let amount = parseFloat(this.amount);    
      this.dialogRef.close({action: 'enter', amount: amount});
    }
  }
}
