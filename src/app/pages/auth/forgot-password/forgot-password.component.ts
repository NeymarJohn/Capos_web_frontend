import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '@service/toast.service';
import {Constants} from '@config/constant';
import {UtilService} from '@service/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../../styles.scss', './forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  
  form: FormGroup;  
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private toastService: ToastService,
    private utilService: UtilService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.init();    
  }

  init(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    this.authService.forgotPassword(this.form.value).subscribe(result => {      
      if (result.error) {
        if(result.error == 'no_existing_email') this.toastService.showFailed('No existing email');
        if(result.error == 'incorrect_email') this.toastService.showFailed('Error while emailing. Please check if email is correct.');
      } else {        
        this.route.navigateByUrl('auth/sign-in');
        this.toastService.showSuccess('New password has been sent in your email.');
      }
    }, error => {      
      this.toastService.showFailed('Server Error. Try again later.');
    });
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }
}
