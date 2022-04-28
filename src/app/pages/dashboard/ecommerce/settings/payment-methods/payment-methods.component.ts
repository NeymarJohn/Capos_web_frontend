import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  frmStripe:FormGroup;
  frmPaypal:FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    public store: Store
  ) {    
    this.frmPaypal = this.fb.group({
      secret:['', [Validators.required]],
      client_id: ['', [Validators.required]],
    });
    this.frmStripe = this.fb.group({
      secret_key:['', [Validators.required]],
      public_key: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.store.load(() => {
      this.frmPaypal.get('secret').setValue(this.store.paypal.secret);
      this.frmPaypal.get('client_id').setValue(this.store.paypal.client_id);
      this.frmStripe.get('secret_key').setValue(this.store.stripe.secret_key);
      this.frmStripe.get('public_key').setValue(this.store.stripe.public_key);
    })
  }

  setActive(new_status, mode:string) {    
    if(mode == 'store_pickup') this.store.store_pickup = new_status;
    if(mode == 'stripe') this.store.stripe.active = new_status;   
    if(mode == 'paypal') this.store.paypal.active = new_status;   
    this.store.save();
  }

  savePaypal(){
    if(this.frmPaypal.valid){
      const data = this.frmPaypal.value;
      Object.keys(data).forEach(key => {
        this.store.paypal[key] = data[key];
      })
      this.store.save(() => {
        this.toastService.showSuccessSave();
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  saveStripe(){
    if(this.frmStripe.valid){
      const data = this.frmStripe.value;
      Object.keys(data).forEach(key => {
        this.store.stripe[key] = data[key];
      })
      this.store.save(() => {
        this.toastService.showSuccessSave();
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  public get secretKeyInput() {return this.frmStripe.get('secret_key')}
  public get secretKeyInputError() {
    if(this.secretKeyInput.hasError('required')) return Constants.message.requiredField;
  }

  public get publicKeyInput() {return this.frmStripe.get('public_key')}
  public get publicKeyInputError() {
    if(this.publicKeyInput.hasError('required')) return Constants.message.requiredField;
  }

  public get secretInput() {return this.frmPaypal.get('secret')}
  public get secretInputError() {
    if(this.secretInput.hasError('required')) return Constants.message.requiredField;
  }

  public get clientIdInput() {return this.frmPaypal.get('client_id')}
  public get clientIdInputError() {
    if(this.clientIdInput.hasError('required')) return Constants.message.requiredField;
  }
}
