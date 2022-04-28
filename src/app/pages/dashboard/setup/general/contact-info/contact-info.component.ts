import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  form: FormGroup;
  user: any;
  profile_image: any = '';
  origin_image = '';
  preview_image:any = '';  
  uploading:boolean = false;
  social_link = {
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    public store:Store
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });
    this.form=this.fb.group({
      first_name:['', [Validators.required]],
      last_name:['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      facebook:[''],
      twitter:[''],
      linkedin:[''],
      youtube:['']
    });
  }

  ngOnInit(): void {
    this.store.load(() => {      
      this.social_link = this.store.social_link;
      this.form.get('first_name').setValue(this.store.first_name);
      this.form.get('last_name').setValue(this.store.last_name);
      this.form.get('email').setValue(this.store.email);
      this.form.get('phone').setValue(this.store.phone);
      this.form.get('facebook').setValue(this.social_link.facebook);
      this.form.get('twitter').setValue(this.social_link.twitter);
      this.form.get('linkedin').setValue(this.social_link.linkedin);
      this.form.get('youtube').setValue(this.social_link.youtube);
    })    
  }
  
  uploadFile(files: any): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {
      this.store.profile_image = result.body.path;
      this.uploading = false;
    }, error => {
      this.uploading = false;
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }

  getImagePath(path:string) {    
    return this.utilService.get_image(path);
  }

  removeImage(path:any) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {      
      this.store.profile_image = null;      
      this.uploading = false;
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

  submit(){    
    if(this.form.valid) {
      const form = this.form.value;   
      const data = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        social_link: {
          facebook: form.facebook,
          twitter: form.twitter,
          linkedin: form.linkedin,
          youtube: form.youtube
        }
      };
      this.store.loadData(data);      
      this.store.save(result => {
        this.toastService.callbackSuccessSave(result, 'Store name or Private web address', null);
      }, error => {
        this.toastService.showFailedSave();
      })
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

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }
}
