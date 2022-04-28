import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { UtilService } from '@service/util.service';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-password-dlg',
  templateUrl: './password-dlg.component.html',
  styleUrls: ['./password-dlg.component.scss']
})
export class PasswordDlgComponent implements OnInit {

  form: FormGroup;
  util = UtilFunc;
  hide: boolean = true; 

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PasswordDlgComponent>,
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilService: UtilService
  ) { 
    this.form = this.fb.group({
      password:['', [Validators.required]]     
    }); 
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){      
      const data = this.form.value;
      data.private_web_address = this.data.user.private_web_address;      
      data.email = this.data.user.email;      
      this.utilService.post('auth/confirm-password', data).subscribe((result) => {                    
        if(result && result.body) {
          let s = result.body;
          if(s.error == 0) {
            this.toastService.showSuccess(Constants.message.validPassword);
            this.dialogRef.close(1);
          } else {
            this.toastService.showWarning(s.msg);
          }
        }        
      }, error => {this.toastService.showFailed(error.error)});
    }
  }

  get passwordInput(): any {return this.form.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
