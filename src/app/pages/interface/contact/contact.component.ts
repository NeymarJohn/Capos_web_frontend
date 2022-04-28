import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  util = UtilFunc;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      enquiry: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.util.scrollToTop();
  }  

  submit() {
    if(this.form.valid) {
      
    }
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get companyInput(): any {return this.form.get('company'); }
  get companyInputError(): string {
    if (this.companyInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.emailInput.hasError('email')) {return Constants.message.validEmail; }    
  }

  get enquiryInput(): any {return this.form.get('enquiry'); }
  get enquiryInputError(): string {
    if (this.enquiryInput.hasError('required')) {return Constants.message.requiredField; }    
  }

}
