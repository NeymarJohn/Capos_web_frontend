import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';
import { Group } from '@app/_classes/group.class';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  groupForm: FormGroup;
  group: Group;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditGroupComponent>,
    private fb: FormBuilder,    
    private toastService: ToastService
  ) {
    this.group = data.group;
    this.groupForm=this.fb.group({
      name:[this.group.name, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.groupForm.valid){   
      this.group.name = this.groupForm.get('name').value;      
      this.group.save(() => {
        this.toastService.showSuccessSave();
        this.dialogRef.close({action:'process'});
      })
    }
  }

  get nameInput(): any {return this.groupForm.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
