import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';
import { Customer } from '@app/_classes/customer.class';

@Component({
  selector: 'app-add-register-dlg',
  templateUrl: './add-register-dlg.component.html',
  styles: [
  ]
})
export class AddRegisterDlgComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddRegisterDlgComponent>,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if(this.data.action == 'edit') {
      this.form.get('name').setValue(this.data.register.name);
    }
  }

  doAction(){
    if(this.form.valid) {      
      this.dialogRef.close({action: this.data.action, regisger: this.form.get('name').value});
    }
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

}
