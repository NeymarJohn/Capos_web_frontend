import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { UtilService } from '@service/util.service';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-new-item-dlg',
  templateUrl: './new-item-dlg.component.html',
  styleUrls: ['./new-item-dlg.component.scss']
})
export class NewItemDlgComponent implements OnInit {
  form: FormGroup;
  util = UtilFunc;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<NewItemDlgComponent>,
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilService: UtilService
  ) {
    this.form = this.fb.group({
      name:['', [Validators.required]]
    });  
   }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){      
      const data = this.form.value;
      data.private_web_address = this.data.user.private_web_address;                    
      this.utilService.post(this.data.url, data).subscribe(result => {
        this.toastService.callbackSuccessSave(result, this.util.toUppercase(this.data.item_name), () => {
          this.dialogRef.close(result)
        }, false);
      }, error => {
        this.toastService.showFailedSave(error);
      });
    }
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
