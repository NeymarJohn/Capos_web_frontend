import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ADDRESS } from "@app/_helpers/util.helper";
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { timezoneList } from '@app/_helpers/util.helper';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-edit-outlet',
  templateUrl: './edit-outlet.component.html',
  styleUrls: ['./edit-outlet.component.scss']
})
export class EditOutletComponent implements OnInit {
  taxList = [];
  countryList = [];
  timezones = timezoneList; 
  outletForm:FormGroup;
  user: any;
  outlet_id: any = {};
  action = 'add';
  is_main: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.route.queryParams.subscribe(query => {
      if (query && query.action) {
        this.action = query.action;
        if (query.action === 'edit') {
          this.outlet_id = query._id;
        }
      }
    });
    this.authService.currentUser.subscribe(user => {
      this.user = user;      
      this.utilService.get('sale/salestax', {user_id: this.user._id, store_name: this.user.store_name}).subscribe(result => {
        this.taxList = result.body;            
      });      
    });
    this.countryList = this.utilService.countries;
  }

  ngOnInit(): void {
    this.outletForm=this.fb.group({
      name:['', [Validators.required]],
      supplierReturnPrefix: [''],
      supplierReturnNumber:[''],
      orderNumberPrefix:[''],
      orderNumber:[''],
      defaultTax:['', [Validators.required]],
      physical_address: this.fb.group(ADDRESS),     
      timezone:['', [Validators.required]], 
      email:['', [Validators.required, Validators.email]],
      phone:[''],
      twitter:['']
    });
    if(this.action == 'edit') {
      this.utilService.get('sell/outlet', {_id: this.outlet_id}).subscribe(result => {
        const outlet = result.body;
        const delKeys = ['_id', '__v', 'is_main', 'created_at', 'private_web_address', 'register'];
        this.is_main = outlet.is_main;
        this.outlet_id = outlet._id;
        for(let i=0;i<delKeys.length;i++) {
          delete outlet[delKeys[i]];
        }
        Object.keys(outlet).forEach(key => {
          this.outletForm.get(key).setValue(outlet[key]);
        })        
      })
    }
  }

  goBack(){
    this.location.back();
  }

  submit(){   
    if(this.outletForm.valid) {
      const data = this.outletForm.value;
      data.private_web_address = this.user.private_web_address;
      data.is_main = this.is_main;
      if(this.action == 'add') {
        this.utilService.post('sell/outlet', data).subscribe(result => {  
          this.toastService.callbackSuccessSave(result, 'Outlet', () => {this.location.back();});                
        }, error => {this.toastService.showFailedSave(error)});
      } else {
        data._id = this.outlet_id;        
        this.utilService.put('sell/outlet', data).subscribe((result) => {                    
          this.toastService.callbackSuccessSave(result, 'Outlet', () => {this.location.back();});      
        }, error => {this.toastService.showFailedSave(error)});
      }
    }
  }

  get nameInput(): any {return this.outletForm.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get taxInput(): any {return this.outletForm.get('defaultTax'); }
  get taxInputError(): string {
    if (this.taxInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get timezoneInput(): any {return this.outletForm.get('timezone'); }
  get timezoneInputError(): string {
    if (this.timezoneInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get emailInput(): any {return this.outletForm.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }
}
