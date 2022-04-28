import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  groupForm: FormGroup;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditGroupComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.groupForm=this.fb.group({
      name:[data.group.name, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.groupForm.valid){   
      const data = this.groupForm.value;   
      data.mode = 'employee';
      data.private_web_address = this.data.user.private_web_address;      
      if(this.data.action==='edit'){
        //TODO: save changed group
        data._id = this.data.group._id;        
        this.utilService.put('customers/group', data).subscribe((result) => {                    
          this.toastService.callbackSuccessSave(result, 'Employee Group', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
      else if(this.data.action==='add'){        
        this.utilService.post('customers/group', data).subscribe(result => {
          this.toastService.callbackSuccessSave(result, 'Employee Group', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
    }
  }

  get nameInput(): any {return this.groupForm.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
