import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService} from '@service/util.service';
import { ToastService } from '@service/toast.service';
import { Constants } from '@config/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as UtilFunc from '@app/_helpers/util.helper';
import { AuthService } from '@app/_services/auth.service';
import { TimesheetDlgComponent } from '@app/pages/dashboard/employees/users/timesheet-dlg/timesheet-dlg.component';
import { RemoveItemDlgComponent } from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';

interface IUser{
  _id: string,
  private_web_address: string,
  first_name: string,
  last_name: string,
  password: string,
  email:string,
  phone: string,
  mobile: string,
  birthday: string,
  role: string,
  outlet: string,
  physical_address: {
    street: string,
    city: string,
    suburb: string,
    postcode: string,
    state: string,
    country: string
  },
  joined_date: string,
  commission: number,
  hour_salary: number,
  is_in_training: boolean
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  form: FormGroup;
  outlets = [];
  roles = [];
  user: IUser;    
  util = UtilFunc;
  cur_user: any;
  hide:boolean = true;
  countries = [];
  add_new: boolean = true;
  timesheets = [];
  displayedColumns=['select', 'date', 'start', 'end', 'hours'];
  dataSource: any;
  all_checked:boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService,
    private authService: AuthService
  ) {  
    this.authService.currentUser.subscribe(user => {
      this.cur_user = user;
    });
    
    this.initUser();    
    
    this.activeRoute.queryParams.subscribe(query => {
      if (query && query._id) {
        this.utilService.get('auth/user', {_id: query._id}).subscribe(result => {
          if(result && result.body) {            
            this.add_new = false;
            this.initForm();
            const user = result.body;
            user.password = '';            
            Object.keys(this.user).forEach(key => {
              if(key == 'outlet' && user.outlet) {
                this.user.outlet = user.outlet._id;
              } else if (key == 'role' && user.role) {
                this.user.role = user.role._id;
              } else if(key == 'birthday' || key == 'joined_date') {
                this.user[key] = this.util.handleDate(user[key]);
              } else {
                this.user[key] = user[key];
              }              
              if(['first_name', 'last_name', 'email', 'password', 'birthday'].includes(key)) {
                this.form.get(key).setValue(user[key]);
              }              
            });
            this.initTimesheets(user._id);
          } else {
            this.toastService.showFailed('No existing user');
            this.location.back();
          }
        })
      } else {
        this.initForm();
      }
    });
  }

  initForm() {
    let passwordValidators = [Validators.minLength(6), Validators.maxLength(12)];
    if (this.add_new) {
      passwordValidators.push(Validators.required);
    }
    this.form = this.fb.group({
      first_name:['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidators], 
      birthday: ['', [Validators.required]]     
    });    
  }

  initUser() {
    this.user = {
      _id: '',
      private_web_address: this.cur_user.private_web_address,
      first_name: '',
      last_name: '',
      password: '',
      email: '',
      phone: '',
      mobile: '',
      birthday: '',
      role: '',
      outlet: '',
      physical_address: {
        street: '',
        city: '',
        suburb: '',
        postcode: '',
        state: '',
        country: ''
      },
      joined_date: '',
      commission: 0,
      hour_salary: 0,
      is_in_training: false
    }
  }

  public get user_data():any {
    const data:any = {physical_address:{}};
    for(const key in this.user){    
      if(key == 'physical_address') {
        for(const key1 in this.user.physical_address){
          data.physical_address[key1] = this.user.physical_address[key1];
        }
      } else {
        data[key] = this.user[key];
      }
    }
    return data;
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
    this.countries = this.utilService.countries;
  }

  submit(){    
    if(this.form.valid){      
      const data = this.user_data;
      for(const key in this.form.value) {
        data[key] = this.form.get(key).value;
      }
      delete data.joined_date;
      if(!this.add_new){
        this.utilService.put('auth/user', data).subscribe(result => {           
          this.toastService.callbackSuccessSave(result, 'User Email', () => {
            //this.location.back();
          });
        }, error => {this.toastService.showFailedSave(error)});
      } else {
        delete data._id;
        this.utilService.post('auth/user', data).subscribe(result => {          
          this.toastService.callbackSuccessSave(result, 'User Email', () => {
            this.location.back();
          });
        }, error => {this.toastService.showFailedSave(error)});
      }
    } else {
      this.toastService.showWarning(Constants.message.invalidFields);
    }
  }

  initTimesheets(user_id) {
    this.all_checked = false;
    this.utilService.get('auth/timesheet', {user_id: user_id}).subscribe(result => {
      if(result && result.body) {
        this.timesheets = result.body;
        for(let t of this.timesheets) {
          t.checked = false;
        }
        this.dataSource = new MatTableDataSource(this.timesheets);        
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  updateAllCheck() {
    this.all_checked = this.timesheets != null && this.timesheets.every(t => t.checked);
  }

  someCheck(): boolean {
    if (this.timesheets == null || this.timesheets.length == 0) {
      return false;
    }
    return this.timesheets.filter(t => t.checked).length > 0 && !this.all_checked;
  }

  setAll(checked: boolean) {
    this.all_checked = checked;
    if (this.timesheets.length == 0) {
      return;
    }
    this.timesheets.forEach(t => t.checked = checked);
  }

  goBack() {
    this.location.back();
  }

  addTimesheet() {
    let timesheet = {
      _id: '',
      start_date: '',
      end_date: '',
      private_web_address: this.user.private_web_address,
      user_id: this.user._id
    }
    const dialogRef = this.dialog.open(TimesheetDlgComponent, {
      width: '400px',
      height: 'auto',
      data: {timesheet: timesheet}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action=='process') {
        this.initTimesheets(this.user._id);
      }
    });
  }

  editTimesheet() {
    let timesheet = this.checkedTimesheet;
    if(timesheet) {      
      const dialogRef = this.dialog.open(TimesheetDlgComponent, {
        width: '400px',
        height: 'auto',
        data: {timesheet: timesheet}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action=='process') {
          this.initTimesheets(this.user._id);
        }
      });
    }
  }

  deleteTimesheets() {
    if(this.checkedTimesheets.length>0) {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '500px', 
        data: { action: 'delete', item: 'Timesheet'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.action === 'delete') {        
          let _ids = [];
          for(let t of this.checkedTimesheets) _ids.push(t._id);
          this.utilService.delete('auth/timesheet?_ids=' + _ids.join(',')).subscribe(result => {
            this.toastService.showSuccessRemove();
            this.initTimesheets(this.user._id);
          }, error => {
            this.toastService.showFailedRemove();
          });         
        }
      });
    }
  }

  get checkedTimesheet() {    
    for(let t of this.timesheets) {
      if(t.checked) {
        return t;
      }
    }
    return null;
  }

  get checkedTimesheets() {
    let timesheets = [];
    for(let t of this.timesheets) {
      if(t.checked) timesheets.push(t);
    }
    return timesheets;
  }

  get firstNameInput(): any {return this.form.get('first_name'); }
  get firstNameInputError(): string {    
    if (this.firstNameInput.hasError('required')) { return Constants.message.requiredField; }
  }
  get lastNameInput(): any {return this.form.get('last_name'); }
  get lastNameInputError(): string {    
    if (this.lastNameInput.hasError('required')) { return Constants.message.requiredField; }
  }
  get birthdayInput(): any {return this.form.get('birthday'); }
  get birthdayInputError(): string {    
    if (this.birthdayInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get emailInput(): any {return this.form.get('email'); }
  get emailInputError(): string {
    if (this.emailInput.hasError('email')) { return Constants.message.validEmail; }
    if (this.emailInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get passwordInput(): any {return this.form.get('password'); }
  get passwordInputError(): string {
    if (this.passwordInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.passwordInput.hasError('minlength')) { return Constants.message.invalidMinLength.replace('?', Constants.password.minLength.toString()); }
    if (this.passwordInput.hasError('maxlength')) { return Constants.message.invalidMaxLength.replace('?', Constants.password.maxLength.toString()); }
  }

}
