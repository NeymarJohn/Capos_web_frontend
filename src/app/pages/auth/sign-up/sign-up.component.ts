import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import {ToastService} from '@app/_services/toast.service';
import {Constants} from '@app/_configs/constant';
import {UtilService} from '@app/_services/util.service';
import { Country } from '@app/_models/country';
import { Currency } from '@app/_models/currency';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../../../styles.scss', './sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  phoneNumber: string;
  isValidNumber = true;
  submitted: boolean;
  hide = true;
  countryList: Country[] = [];
  currencies: Currency[] = [];
  duplicatedWebAdd: boolean = false;
  duplicatedStoreName: boolean = false;
  duplicatedEmail: boolean = false;
  private ipAddress: any;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.countryList = this.utilService.countries;   
    this.currencies = this.utilService.currencies;    
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.initForm();
  }

  initForm(): void {
    this.authService.ipAddress.subscribe(result => {
      this.ipAddress = result;
    });
    this.signUpForm = this.formBuilder.group({
      private_web_address: ['', [Validators.required, Validators.minLength(8)]],
      store_name: ['', [Validators.required]],
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      country: ['', [Validators.required]],
      default_currency: ['', [Validators.required]]
    });
  }

  get privateWebAddressInput(): any {return this.signUpForm.get('private_web_address'); }

  get privateWebAddressInputError(): string {
    if (this.privateWebAddressInput.hasError('required')) {return Constants.message.requiredField; }
    else if (this.privateWebAddressInput.hasError('minlength')) {return 'This field must be more than 8 letters'; }
    else if (this.duplicatedWebAdd) {return 'This Private Web Address is already in use'; }
  }

  get storeNameInput(): any {return this.signUpForm.get('store_name'); }
  get storeNameInputError(): string {
    if (this.storeNameInput.hasError('required')) { return Constants.message.requiredField; }
    else if (this.duplicatedStoreName) {return 'This Store Name is already in use'; }
  }

  get firstNameInput(): any {return this.signUpForm.get('first_name'); }
  get firstNameInputError(): string {
    if (this.firstNameInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get emailInput(): any {return this.signUpForm.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    else if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
    else if (this.duplicatedEmail) {return Constants.message.duplicatedEmail; }
  }

  get phoneNumberInput(): any {return this.signUpForm.get('phone'); }
  get phoneNumberInputError(): any {
    if (this.phoneNumberInput.hasError('required')) { return Constants.message.requiredField; }
    if (!this.isValidNumber) { return 'Please enter valid phone number'; }
  }

  get passwordInput(): any {return this.signUpForm.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.passwordInput.hasError('minlength')) { return Constants.message.invalidMinLength.replace('?', Constants.password.minLength.toString()); }
    if (this.passwordInput.hasError('maxlength')) { return Constants.message.invalidMaxLength.replace('?', Constants.password.maxLength.toString()); }
  }

  get countryInput(): any {return this.signUpForm.get('country'); }
  get countryInputError(): string {
    if (this.countryInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get currencyInput(): any {return this.signUpForm.get('default_currency'); }
  get currencyInputError(): string {
    if (this.currencyInput.hasError('required')) { return Constants.message.requiredField; }
  }

  getPhoneNumber(event): any {
    this.phoneNumber = event;
  }

  hasPhoneNumberError(event): any {
    this.isValidNumber = event;
  }

  signUp(): any {
    this.submitted = true;
    if (this.signUpForm.invalid || !this.isValidNumber) {
      return;
    }
    this.loading = true;
    this.signUpForm.value.ip_address = this.ipAddress;    
    this.signUpForm.value.phone = this.phoneNumber;
    this.authService.signUp(this.signUpForm.value).subscribe(result => {      
      const s = result; let msg = 'User registered successfully';
      this.loading = false;
      if(s.status) {
        if(s.status.private_web_address == 1) {
          this.duplicatedWebAdd = true;
        }
        if(s.status.store_name == 1) {
          this.duplicatedStoreName = true;
        }
        if(s.status.email == 1) {
          this.duplicatedEmail = true;
        }
      } else {        
        if(s.sent_email) msg += '<br>Please verify your email.';
        this.toastService.showSuccess(msg);
        this.router.navigateByUrl('auth/sign-in')
      }
    }, error => {      
      this.loading = false;
      this.toastService.showFailed('Please check your information', 'Register Failed');
    });
  }

  onKeydown(field: string) {
    if(field == 'private_web_address') this.duplicatedWebAdd = false;
    if(field == 'store_name') this.duplicatedStoreName = false;
    if(field == 'email') this.duplicatedEmail = false;
    return true;
  }

  onKeypress(event) {
    var key = event.keyCode;
    if (key === 32) {
      event.preventDefault();
    }
  }
}
