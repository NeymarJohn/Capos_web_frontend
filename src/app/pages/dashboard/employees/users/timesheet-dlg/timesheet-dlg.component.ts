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
  mode:string = 'Add';
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
    });    
    this.timesheet = data.timesheet;
    if(this.timesheet._id) {
      this.mode = 'Edit';
    }
    this.form = this.fb.group({
      start_date:[this.timesheet.start_date, [Validators.required]],
      end_date: [this.timesheet.end_date]
    });    
  }

  ngOnInit(): void {
    
  }

  doAction(){    
    if(this.form.valid){     
      const data = {
        _id: this.timesheet._id,
        start_date: this.form.get('start_date').value,
        end_date: this.form.get('end_date').value ? this.form.get('end_date').value : null,
        private_web_address: this.timesheet.private_web_address,
        user_id: this.timesheet.user_id
      };            
      if(this.timesheet._id) {
        delete data.private_web_address;
        delete data.user_id;
        this.utilService.put('auth/timesheet', data).subscribe(result => {
          this.toastService.showSuccessSave();
          this.dialogRef.close({action: 'process'})
        })
      } else {        
        delete data._id;        
        this.utilService.post('auth/timesheet', data).subscribe(result => {
          this.toastService.showSuccessSave();
          this.dialogRef.close({action: 'process'})
        })
      }
    } 
  }

  get startDateInput(): any {return this.form.get('start_date'); }
  get startDateInputError(): string {    
    if (this.startDateInput.hasError('required')) { return Constants.message.requiredField; }
  }

}
