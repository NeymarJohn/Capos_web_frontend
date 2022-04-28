import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import { ADDRESS } from "@app/_helpers/util.helper";
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@app/_configs/constant';
import { Customer } from '@app/_classes/customer.class';
import { AuthService } from '@app/_services/auth.service';
import { Country } from '@app/_models/country';

@Component({
  selector: 'app-customer-action',
  templateUrl: './customer-action.component.html',
  styleUrls: ['./customer-action.component.scss']
})
export class CustomerActionComponent implements OnInit {
  util = UtilFunc;
  form: FormGroup;
  countries:Country[] = [];
  existPostalAddress: boolean = false;
  mode: string = 'add';
  customerId = '';
  groups = [];
  sticky: boolean = false;
  customer:Customer;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location
  ) {    
    this.customer = new Customer(this.authService, this.utilService);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.initForm();    
    const dataGroup = {mode:'customer'};
    this.utilService.get('customers/group', dataGroup).subscribe(result => {      
      this.groups = result.body;
    });    
    this.countries = this.utilService.countries;      

    this.customer.init();

    this.router.queryParams.subscribe(query => {
      if (query && query.id) {
        this.mode = 'edit';
        this.customer.loadById(query.id, () => {
          const data = this.form.value;
          Object.keys(data).forEach(key => {
            if(key == 'groupId' && this.customer.data.groupId) {
              this.form.get('groupId').setValue(this.customer.data.groupId._id);
            } else {
              this.form.get(key).setValue(this.customer.data[key]);
            }
          })
        }, () => {
          this.toastService.showFailed(Constants.message.noExistingCustomer);
          this.goBack();
        })
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      groupId: [''],
      email: ['', [Validators.email, Validators.required]],
      note: [''],
      code: [''],
      gender: ['Male'],
      birthday: [''],
      company: [''],
      mobile: [''],
      phone: [''],
      fax: [''],
      website: [''],
      twitter: [''],      
      physical_address: this.fb.group(ADDRESS),
      postal_address: this.fb.group(ADDRESS),
      custom_information: this.fb.group({
        field1: [''],
        field2: ['']
      })
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    Object.keys(data).forEach(key => {     
      this.customer.data[key] = this.form.get(key).value;
    })
    this.customer.save((result) => {
      this.toastService.callbackSuccessSave(result, 'Customer name or email', () => {
        this.route.navigate(['/dashboard/customers']);
      });        
    }, error => {
      this.toastService.showFailedSave(error);
    })
  }

  goBack(): void {
    this.location.back();
  }

  addPostalAddress(): void {
    if (this.existPostalAddress) {
      this.form.controls.postal_address = this.fb.group(ADDRESS);
    } else {
      this.form.controls.postal_address = this.fb.group({});
    }
  }

  scroll = (event: any): void => {
    const num = event.srcElement.scrollTop;
    this.sticky = num > 64;
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scroll, true);
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.emailInput.hasError('email')) {return Constants.message.validEmail; }    
  }

}
