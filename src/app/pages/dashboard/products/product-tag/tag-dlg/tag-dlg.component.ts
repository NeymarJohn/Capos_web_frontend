import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { UtilService } from '@service/util.service';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-tag-dlg',
  templateUrl: './tag-dlg.component.html',
  styleUrls: ['./tag-dlg.component.scss']
})
export class TagDlgComponent implements OnInit {

  form: FormGroup;
  action: string = 'add';
  util = UtilFunc;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<TagDlgComponent>,
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilService: UtilService
  ) { 
    this.form = this.fb.group({
      name:[data.item.name, [Validators.required]]     
    }); 
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){      
      const data = this.form.value;
      data.private_web_address = this.data.user.private_web_address;      
      if(this.data.action==='edit'){
        //TODO: save changed payment
        data._id = this.data.item._id;
        this.utilService.put('product/tag', data).subscribe((result) => {                    
          this.toastService.callbackSuccessSave(result, 'Tag', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
      else if(this.data.action==='add'){
        //TODO: add new payment        
        this.utilService.post('product/tag', data).subscribe(result => {
          this.toastService.callbackSuccessSave(result, 'Tag', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
    }
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
