import {Component, Inject, OnInit, Optional, AfterViewInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-quantity-dlg',
  templateUrl: './quantity-dlg.component.html',
  styleUrls: ['./quantity-dlg.component.scss']
})
export class QuantityDlgComponent implements OnInit, AfterViewInit {
  quantity:string = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,    
    private dialogRef: MatDialogRef<QuantityDlgComponent>,
  ) { 
    this.quantity = data.quantity;
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  enterNum(str) {    
    if(str == '.') {
     if(!this.quantity.toString().includes('.')) this.quantity += '.';
    } else {
      this.quantity += str;
    }
  }

  backspace() {
    let len = this.quantity.length;
    if(len > 0) {
      this.quantity = this.quantity.toString().substring(0, len-1);
    }
  }

  clear() {
    this.quantity = '';
  }

  doAction(){
    if(this.quantity) {
      let qty = parseInt(this.quantity);    
      this.dialogRef.close({action: 'enter', qty: qty});
    }
  }
}
