import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-discount-dlg',
  templateUrl: './discount-dlg.component.html',
  styles: [
  ]
})
export class DiscountDlgComponent implements OnInit {

  form: FormGroup;
  mode: string = 'percent';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<DiscountDlgComponent>,
    private fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      mode:[data.discount.mode],
      value: [data.discount.value, [Validators.required]]
    });         
    this.mode = data.discount.mode;
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){     
      this.data.discount.mode = this.form.get('mode').value;
      this.data.discount.value = Number(this.form.get('value').value);
      this.dialogRef.close({action: 'process'});
    }
  }

  get valueInput(): any {return this.form.get('value'); }
  get valueInputError(): string {
    if (this.valueInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.valueInput.hasError('min')) {return Constants.message.invalidMinValue.replace('?', Constants.discount.min.toString()); }    
  }
}
