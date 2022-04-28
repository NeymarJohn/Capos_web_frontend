import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '@service/toast.service';
import {Constants} from '@config/constant';
import {UtilService} from '@service/util.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../../../../styles.scss', './sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {

  hide = true;
  signInForm: FormGroup;
  invalidEmailOrPwd: boolean;
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
    this.signInForm = this.formBuilder.group({
      private_web_address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
  }

  signIn(): any {
    if (this.signInForm.invalid) {
      return;
    }
    this.authService.signIn(this.signInForm.value).subscribe(result => {      
      if (result.error) {
        if(result.error == 'private_web_address') {
          this.toastService.showFailed('Incorrect private web address');
        } else if (result.error == 'email') {
          this.toastService.showFailed('No existing email');
        } else {
          this.toastService.showFailed('Incorrect password');
        }
      } else {
        let user = result.token;
        if (user.email_verify) {
          this.route.navigateByUrl('dashboard');
          this.toastService.showSuccess(Constants.message.successLogin);
        } else {
          this.utilService.post('auth/send-email-verification', {email: user.email}).subscribe(response => {
            this.toastService.showFailed(Constants.message.notVerifiedEmail);
          });
        }
      }
    }, error => {      
      this.toastService.showFailed('Server Error. Try again later.');
    });
  }

  get storeNameInput(): any {return this.signInForm.get('private_web_address'); }
  get storeNameInputError(): string {
    if (this.storeNameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get emailInput(): any {return this.signInForm.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get passwordInput(): any {return this.signInForm.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.passwordInput.hasError('minlength')) { return Constants.message.invalidMinLength.replace('?', Constants.password.minLength.toString()); }
    if (this.passwordInput.hasError('maxlength')) { return Constants.message.invalidMaxLength.replace('?', Constants.password.maxLength.toString()); }
  }

}
