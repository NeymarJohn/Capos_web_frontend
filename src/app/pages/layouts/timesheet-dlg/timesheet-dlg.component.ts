import { Component, Inject, OnInit, Optional} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilService} from '@service/util.service';
import { ToastService } from '@service/toast.service';
import { Constants } from '@config/constant';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-timesheet-dlg',
  templateUrl: './timesheet-dlg.component.html',
  styleUrls: ['./timesheet-dlg.component.scss']
})
export class TimesheetDlgComponent implements OnInit {
  form: FormGroup; 
  cur_user: any;
  timesheet: any;  
  mode:string = 'in';
  users = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<TimesheetDlgComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService,
    private authService: AuthService
  ) {  
    this.authService.currentUser.subscribe(user => {
      this.cur_user = user;
      this.utilService.get('auth/users', {user_id: user._id}).subscribe(result => {
        this.users = result.body;
      })
    });        
    if(!data.user_id) {
      this.mode = 'in';
      this.form = this.fb.group({
        user_id: ['', [Validators.required, Validators.min(1)]],
        start_date:[new Date(), [Validators.required]]        
      });    
    } else {
      this.mode = 'out';
      this.form = this.fb.group({
        end_date:[new Date(), [Validators.required]]        
      });    
    }
  }

  ngOnInit(): void {
    
  }

  doAction(){    
    if(this.form.valid){     
      if(!this.data.user_id) {
        const data = {
          user_id: this.form.get('user_id').value,
          start_date: this.form.get('start_date').value,
          end_date: null,
          private_web_address: this.cur_user.private_web_address        
        };      
        this.utilService.post('auth/timesheet', data).subscribe(result => {
          this.toastService.showSuccessSave();
          this.dialogRef.close({action: 'process', user_id: data.user_id});
        })
      } else {
        const data = {
          user_id: this.data.user_id,          
          end_date: this.form.get('end_date').value
        };      
        this.utilService.put('auth/timesheet', data).subscribe(result => {
          this.toastService.showSuccessSave();
          this.dialogRef.close({action: 'process', user_id: data.user_id});
        })
      }
    }
  }

  public get user_name():string {
    let result = '';
    let index = this.users.findIndex(item => item._id == this.data.user_id);
    if(index > -1) {
      let user = this.users[index];
      result = user.first_name + ' ' + user.last_name;
    }
    return result;
  }

  get userIdInput(): any {return this.form.get('user_id'); }
  get userIdInputError(): string {    
    if (this.userIdInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.userIdInput.hasError('min')) { return Constants.message.invalidMinValue.replace("?", "1"); }
  }

  get startDateInput(): any {return this.form.get('start_date'); }
  get startDateInputError(): string {    
    if (this.startDateInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get endDateInput(): any {return this.form.get('end_date'); }
  get endDateInputError(): string {    
    if (this.endDateInput.hasError('required')) { return Constants.message.requiredField; }
  }

}
