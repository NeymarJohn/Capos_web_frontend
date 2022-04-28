import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { ADDRESS } from "@app/_helpers/util.helper";
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  countries = [];
  form: FormGroup;  
  user: any;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    public store: Store
  ) {    
    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });
    this.countries = this.utilService.countries;
    this.form = this.fb.group({
      physical_address: this.fb.group(ADDRESS),
      postal_address: this.fb.group(ADDRESS)
    });
  }

  ngOnInit(): void {        
    this.store.load(() => {      
      this.form.get('physical_address').setValue(this.store.physical_address);
      this.form.get('physical_address').get('country').setValue(this.store.physical_address.country?this.store.physical_address.country._id: null);
      this.form.get('postal_address').setValue(this.store.postal_address);
      this.form.get('postal_address').get('country').setValue(this.store.postal_address.country?this.store.postal_address.country._id: null);
    })    
  }

  submit(){
    if(this.form.valid) {      
      const data = this.form.value; 
      if(data.physical_address.country) {
        data.physical_address.country = this.getCountry(data.physical_address.country);
      }
      if(data.postal_address.country) {
        data.postal_address.country = this.getCountry(data.postal_address.country);
      }
      this.store.loadData(data);
      this.store.save(() => {
        this.toastService.showSuccessSave();
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  getCountry(_id:string) {
    let index = this.countries.findIndex(item => item._id == _id);
    if(index>-1) {
      return this.countries[index];
    }
    return null;
  }
}
