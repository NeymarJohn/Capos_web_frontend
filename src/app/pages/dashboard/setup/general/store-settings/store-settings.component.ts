import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';
import { Store } from '@app/_classes/store.class';
import { Currency } from '@app/_models/currency';

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.scss']
})
export class StoreSettingsComponent implements OnInit {
  securities = Constants.securities;
  currencies:Currency[] = [];  
  form: FormGroup;
  user: any;  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    private store:Store
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;            
    });

    this.form = this.fb.group({
      private_web_address: [''],
      store_name:[''],
      default_currency: [''],
      default_tax: [''],
      template:[''],
      domain_name: [''],
      user_switch_security: [1]
    });
  }

  ngOnInit(): void {
    this.currencies = this.utilService.currencies;
    
    this.store.load(() => {
      this.form.get('store_name').setValue(this.store.store_name);
      this.form.get('private_web_address').setValue(this.store.private_web_address);
      this.form.get('default_currency').setValue(this.store.default_currency ? this.store.default_currency._id: null);
      this.form.get('default_tax').setValue(this.store.default_tax);
      this.form.get('template').setValue(this.store.template);
      // this.form.get('sequence_number').setValue(this.store.sequence_number);
      this.form.get('domain_name').setValue(this.store.domain_name);
      this.form.get('user_switch_security').setValue(this.store.user_switch_security);
    })
  }

  submit(){
    if(this.form.valid) {
      const data = this.form.value;   
      if(data.default_currency) {
        data.default_currency = this.getCurrency(data.default_currency);
      }
      this.store.loadData(data);
      this.store.save(result => {
        if(result.body.status == 'already_exist') {
          this.toastService.showWarningDuplicate(result.body.fields.join(','));
        } else {
          this.toastService.showSuccessSave();
        }
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  getCurrency(_id: string) {
    let index = this.currencies.findIndex(item => item._id == _id);
    if(index>-1) {
      return this.currencies[index];
    }
    return null;
  }

  get storeNameInput(): any {return this.form.get('store_name'); }
  get storeNameInputError(): string {
    if (this.storeNameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  // get sequenceInput(): any {return this.form.get('sequence_number'); }
  // get sequenceInputError(): string {
  //   if (this.sequenceInput.hasError('required')) {return Constants.message.requiredField; }    
  // }

  get domainNameInput(): any {return this.form.get('domain_name'); }
  get domainNameInputError(): string {
    if (this.domainNameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get taxInput(): any {return this.form.get('default_tax'); }
  get taxInputError(): string {
    if (this.taxInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get currencyInput(): any {return this.form.get('default_currency'); }
  get currencyInputError(): string {
    if (this.currencyInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
