import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-edit-sales-tax',
  templateUrl: './edit-sales-tax.component.html',
  styleUrls: ['./edit-sales-tax.component.scss']
})
export class EditSalesTaxComponent implements OnInit {
  taxForm: FormGroup;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditSalesTaxComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.taxForm=this.fb.group({
      name:[data.tax.name, [Validators.required]],
      rate: [data.tax.rate, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.taxForm.valid){            
      const data=this.taxForm.value;
      data.private_web_address = this.data.user.private_web_address;      
      if(this.data.action==='edit'){
        //TODO: save changed data
        data._id = this.data.tax._id;        
        this.utilService.put('sale/salestax', data).subscribe((result) => {                    
          this.toastService.callbackSuccessSave(result, 'Sales Tax', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
      else if(this.data.action==='add'){
        //TODO: add new data                
        this.utilService.post('sale/salestax', data).subscribe(result => {
          this.toastService.callbackSuccessSave(result, 'Sales Tax', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
    }
  }

  get nameInput(): any {return this.taxForm.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get rateInput(): any {return this.taxForm.get('rate'); }
  get rateInputError(): string {
    if (this.rateInput.hasError('required')) {return Constants.message.requiredField; }    
  }

}
