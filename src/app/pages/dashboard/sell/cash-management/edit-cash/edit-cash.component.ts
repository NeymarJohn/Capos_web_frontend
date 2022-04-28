import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from '@service/util.service';
import { ToastService } from '@service/toast.service';
import { AuthService } from '@service/auth.service';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-edit-cash',
  templateUrl: './edit-cash.component.html',
  styleUrls: ['./edit-cash.component.scss']
})
export class EditCashComponent implements OnInit {
  cashForm: FormGroup;
  user: any;
  main_outlet: any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditCashComponent>,
    private utilService: UtilService,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });    

    this.cashForm = this.fb.group({
      reasons: [data.cash.reasons, [Validators.required]],
      transaction: [data.cash.transaction, [Validators.required, Validators.min(1)]],
      is_credit: [data.cash.is_credit]
    });

    this.utilService.get('sell/outlet', {is_main: true}).subscribe(result => {
      if(result && result.body) {
        this.main_outlet = result.body[0];
      }
    })
  }

  ngOnInit(): void {
  }

  doAction(){    
    if(this.cashForm.valid){      
      let cashData=this.cashForm.value;
      if(this.data.action==='edit'){
        //TODO: save changed cash
        cashData._id = this.data.cash._id;        
        this.utilService.put('sell/cash', cashData).subscribe(() => {                    
          this.toastService.showSuccessSave();
          this.dialogRef.close(1);
        }, error => {          
          this.toastService.showFailedSave();
        });
      }
      else if(this.data.action==='add'){
        cashData.private_web_address = this.user.private_web_address;
        cashData.outlet = this.user.outlet ? this.user.outlet._id : this.main_outlet._id;
        cashData.user_id = this.user._id;
        cashData.register = this.user.outlet ? this.user.outlet.register[0] : this.main_outlet.registers[0];
        //TODO: add new cash
        this.utilService.post('sell/cash', cashData).subscribe(result => {          
          this.toastService.showSuccessSave();
          this.dialogRef.close(1);
        }, error => {          
          this.toastService.showFailedSave();
        });
      }
    }    
  }

  get reasonsInput(): any {return this.cashForm.get('reasons'); }
  get reasonsInputError(): string {
    if (this.reasonsInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get transactionInput(): any {return this.cashForm.get('transaction'); }
  get transactionInputError(): string {
    if (this.transactionInput.hasError('required')) {return Constants.message.requiredField; }    
    if (this.transactionInput.hasError('min')) {return Constants.message.invalidMinValue.replace('?', Constants.cash_transaction.min.toString()); }    
  }
}
