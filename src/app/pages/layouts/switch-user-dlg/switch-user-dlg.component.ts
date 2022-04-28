import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-switch-user-dlg',
  templateUrl: './switch-user-dlg.component.html',
  styles: [
  ]
})
export class SwitchUserDlgComponent implements OnInit {  

  form:FormGroup;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<SwitchUserDlgComponent>,
    private fb:FormBuilder
  ) { 
         
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  submit(){        
    if(this.form.valid) {
      this.dialogRef.close({action: 'process', data: this.form.value});
    }
  }

  exit() {
    this.dialogRef.close();
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.emailInput.hasError('email')) {return Constants.message.validEmail; }    
  }

  get passwordInput(): any {return this.form.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
