import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { Currency } from '@app/_models/currency';
import { Country } from '@app/_models/country';

@Component({
  selector: 'app-start-trial',
  templateUrl: './start-trial.component.html',
  styleUrls: ['../../../styles.scss', './start-trial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StartTrialComponent implements OnDestroy, OnInit {

  mobileQuery: MediaQueryList;
  util = UtilFunc;
  form: FormGroup;
  countries:Country[] = [];
  currencies:Currency[] = [];

  private readonly mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private fb: FormBuilder,
    private utilService: UtilService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 2000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    
    this.form = this.fb.group({
      private_web_address: ['', [Validators.required]],      
      store_name: ['', [Validators.required]],      
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],      
      phone: [''],
      country: ['', [Validators.required]],
      default_currency: ['', [Validators.required]]
    })
    this.countries = this.utilService.countries;      
    this.currencies = this.utilService.currencies;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnInit() {
      		
  }

  submit() {
    if(this.form.valid) {

    }
  }

  get firstNameInput(): any {return this.form.get('first_name'); }
  get firstNameInputError(): string {
    if (this.firstNameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get lastNameInput(): any {return this.form.get('last_name'); }
  get lastNameInputError(): string {
    if (this.lastNameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get storeNameInput(): any {return this.form.get('store_name'); }
  get storeNameInputError(): string {
    if (this.storeNameInput.hasError('required')) {return Constants.message.requiredField; }    
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

  get confirmPasswordInput(): any {return this.form.get('confirm_password'); }
  get confirmPasswordInputError(): string {
    if (this.confirmPasswordInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get countryInput(): any {return this.form.get('country'); }
  get countryInputError(): string {
    if (this.countryInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get webAddressInput(): any {return this.form.get('private_web_address'); }
  get webAddressInputError(): string {
    if (this.webAddressInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get currencyInput(): any {return this.form.get('default_currency'); }
  get currencyInputError(): string {
    if (this.currencyInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
