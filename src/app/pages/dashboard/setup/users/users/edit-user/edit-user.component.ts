import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService} from '@service/util.service';
import { ToastService } from '@service/toast.service';
import {Constants} from '@config/constant';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  profile_image: any = '';
  origin_image = '';
  preview_image:any = '';
  outlets = [];
  roles = [];
  user: any;  
  errorMatcher = new CrossFieldErrorMatcher();  

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditUserComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    let passwordValidators = [Validators.minLength(6), Validators.maxLength(12)];
    if (data.action == 'add') {
      passwordValidators.push(Validators.required);
    }
    this.userForm = this.fb.group({
      first_name:[data.item.first_name, [Validators.required]],
      last_name: [data.item.last_name, [Validators.required]],
      email: [data.item.email, [Validators.required, Validators.email]],
      outlet: [data.item.outlet],
      role: [data.item.role],
      password: ['', passwordValidators],
      phone: [data.item.phone],
      daily_target: [data.item.daily_target],
      weekly_target: [data.item.weekly_target],
      monthly_target: [data.item.monthly_target],
      confirm_password: [''],        
      file:['']
    }, {
      validator: this.passwordValidator
    });    
    this.origin_image = data.item.profile_image;
    this.user = data.user;
    this.getProfileImageSrc();    
  }

  ngOnInit(): void {
    this.roles = [{_id:'', name:'Free'}];
    this.utilService.get('auth/role', {}).subscribe(result => {
      this.roles = this.roles.concat(result.body);
    });   
    this.outlets = [{_id:'', name:'All Outlets'}];
    this.utilService.get('sell/outlet', {}).subscribe(result => {
      this.outlets = this.outlets.concat(result.body);
    });    
  }

  doAction(){
    if(this.userForm.valid){
      const formData = new FormData();
      formData.append('private_web_address', this.user.private_web_address);
      Object.keys(this.userForm.value).forEach(key=>{
        if(key == 'password') {
          if(this.userForm.value.password){
            formData.append('password', this.userForm.value.password);   
          }
        } else if(key !== 'confirm_password' && key != 'file'){
          formData.append(key, this.userForm.value[key]);
        }
      })
      formData.append('file', this.profile_image);
      formData.append('profile_image', '');   

      if(this.data.action==='edit'){        
        formData.append('_id', this.data.item._id);  
        this.utilService.put('auth/user', formData).subscribe((result) => {
          this.toastService.callbackSuccessSave(result.result, 'User Email', () => {
            this.dialogRef.close(1);
          });
        }, error => {this.toastService.showFailedSave(error)});
      }
      else if(this.data.action==='add'){                
        this.utilService.post('auth/user', formData).subscribe(result => {
          this.toastService.callbackSuccessSave(result.result, 'User Email', () => {
            this.dialogRef.close(1);
          });
        }, error => {this.toastService.showFailedSave(error)});
      }
    } else {
      this.toastService.showWarning(Constants.message.invalidFields);
    }
  }

  chooseFile(files:any) {
    this.profile_image = files[0];
    this.getProfileImageSrc();
  }

  getProfileImageSrc() {
    if(this.profile_image) {
      var reader = new FileReader();     
      reader.onload = (e) => {
        this.preview_image = e.target.result;
      }
      reader.readAsDataURL(this.profile_image); // convert to base64 string
    } else if(this.origin_image) {
      this.preview_image = this.utilService.get_image(this.origin_image);
    }
  }

  get firstNameInput(): any {return this.userForm.get('first_name'); }
  get firstNameInputError(): string {    
    if (this.firstNameInput.hasError('required')) { return Constants.message.requiredField; }
  }
  get lastNameInput(): any {return this.userForm.get('last_name'); }
  get lastNameInputError(): string {    
    if (this.lastNameInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get emailInput(): any {return this.userForm.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get passwordInput(): any {return this.userForm.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.passwordInput.hasError('minlength')) { return Constants.message.invalidMinLength.replace('?', Constants.password.minLength.toString()); }
    if (this.passwordInput.hasError('maxlength')) { return Constants.message.invalidMaxLength.replace('?', Constants.password.maxLength.toString()); }
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password').value !== form.get('confirm_password').value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }

}
