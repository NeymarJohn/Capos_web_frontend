import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '@service/auth.service';
import * as UtilFunc from '@helper/util.helper';
import { ADDRESS } from '@helper/util.helper';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-supplier-action',
  templateUrl: './supplier-action.component.html',
  styleUrls: ['./supplier-action.component.scss']
})
export class SupplierActionComponent implements OnInit {
  form: FormGroup;
  countries = [];
  existPostalAddress: boolean = false;
  user: any;
  mode: string;
  supplier: any;
  supplierId = '';
  util = UtilFunc;
  sticky: boolean;
  
  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });

    this.router.queryParams.subscribe(query => {
      if (query && query.mode === 'add') {
        this.mode = 'add';
      } else if (query.mode === 'edit') {
        this.mode = 'edit';        
        this.utilService.get('product/supplier', {_id: query.id}).subscribe(result => {
          this.supplier = result.body;
          this.supplierId = this.supplier._id;
          this.existPostalAddress = this.supplier.exist_postal_address;
          const keysToDelete = ['_id', 'created_at', 'private_web_address', 'products', 'is_deleted', 'exist_postal_address', '__v'];
          for(let index in keysToDelete) {
            delete this.supplier[keysToDelete[index]];
          }                    
          this.form.setValue(this.supplier);
        });
      }
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.initForm();
    this.countries = this.utilService.countries;
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      markup: ['0'],
      description: [''],
      first_name: [''],
      last_name: [''],
      company: [''],
      email: ['', [Validators.email]],
      phone: [''],
      mobile: [''],
      fax: [''],
      website: [''],
      twitter: [''],
      physical_address: this.fb.group(ADDRESS),      
      postal_address: this.fb.group(ADDRESS)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    data.exist_postal_address = this.existPostalAddress;
    data.private_web_address = this.user.private_web_address;    
    if (this.mode === 'add') {
      this.utilService.post('product/supplier', data).subscribe(result => {
        this.toastService.callbackSuccessSave(result, 'Supplier', () => {this.goBack()});        
      }, error => {this.toastService.showFailedSave(error)});
    } else {
      data._id = this.supplierId;
      this.utilService.put('product/supplier', data).subscribe(result => {
        this.toastService.callbackSuccessSave(result, 'Supplier', () => {this.goBack()});
      }, error => {this.toastService.showFailedSave(error)});
    }
  }

  goBack(): void {
    this.location.back();
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }    
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
}
