import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/_configs/constant';
import { UtilService } from 'src/app/_services/util.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AuthService } from '@service/auth.service';
import { Openclose } from '@app/_classes/openclose.class';
import { ConfirmDlgComponent } from '@layout/confirm-dlg/confirm-dlg.component';
import { MatDialog } from '@angular/material/dialog';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register.component.html',
  styleUrls: ['./open-register.component.scss']
})

export class OpenRegisterComponent implements OnInit {
  
  form: FormGroup;  
  user:any;
  showCash: boolean = false;
  util = UtilFunc;
  public lastClose: Openclose = null;
  mode: string = 'open';  
  title = {open: 'Open Register', close: 'Close Register'};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    public openClose: Openclose,
    private dialog: MatDialog
  ) { 
    this.authService.checkPremission('close_register');
    this.form = this.fb.group({      
      open_value: ['1', [Validators.required, Validators.min(1)]],
      open_note: ['']
    });
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void { 
    this.utilService.isSpinnerVisible = true;
    this.openClose.init();
    const query = {
        private_web_address: this.user.private_web_address, 
        outlet: this.user.outlet ? this.user.outlet._id : null,
        register: this.user.outlet.register[0]
    };
    if(!this.user.outlet) delete query.outlet;
    this.utilService.get('sell/openclose', query).subscribe(result => {             
      if(result && result.body.length>0) {
        let c = result.body[0];
        if(c.status == 1) {          
          this.openClose.loadCurrent(() => {
            this.mode = 'close';
            this.utilService.isSpinnerVisible = false;
          }, () => {
            this.utilService.isSpinnerVisible = false;
          });
        } else {
          this.utilService.isSpinnerVisible = false;
          this.lastClose = new Openclose(this.authService, this.utilService);
          this.lastClose.init();
          this.lastClose.loadDetails(c);
        }
      } else {
        this.utilService.isSpinnerVisible = false;
      }
    }, error => {
      this.utilService.isSpinnerVisible = false;
      this.toastService.showFailed('Something went wrong. Try again later');
      this.router.navigate(['dashboard']);
    });
  }

  save(){
    if(this.form.valid){
      const data = this.form.value;
      this.openClose.open_value = data.open_value;
      this.openClose.open_note = data.open_note;      
      this.openClose.save(() => {
        this.toastService.showSuccess(Constants.message.successOpenRegister);
        this.openClose.loadCurrent();        
        this.mode = 'close';
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  closeRegister(){
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Close Register', 
        msg: 'Are you sure to close this register?',
        ok_button: 'OK',
        cancel_button: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        this.openClose.status = 2;        
        this.openClose.save(() => {
          this.toastService.showSuccess('Register Closed successfully.', 'Close Register');
          // this.router.navigate(['dashboard/sell/open-register']);
          this.openClose.init();
          this.mode = 'open';
        })
      } 
    });
  }

  get floatInput(): any {return this.form.get('open_value'); }
  get floatInputError(): string | void {    
    if (this.floatInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.floatInput.hasError('min')) { return Constants.message.invalidMinValue.replace('?', Constants.open_value.min.toString()); }
  }  
}
