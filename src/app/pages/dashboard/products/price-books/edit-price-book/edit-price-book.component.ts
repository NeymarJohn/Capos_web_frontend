import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICustomerGroup } from '@app/_models/customer-group';
import { IOutlet } from '@app/_models/outlet';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-edit-price-book',
  templateUrl: './edit-price-book.component.html',
  styleUrls: ['./edit-price-book.component.scss']
})
export class EditPriceBookComponent implements OnInit {
  bookForm: FormGroup;
  customerGroups:ICustomerGroup[] = [];
  outlets:IOutlet[] = [];
  bookFile: any = '';
  action: string = 'add';
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditPriceBookComponent>,
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilService: UtilService
  ) {    
    this.bookForm = this.fb.group({
      name:[data.pb.name, [Validators.required]],
      groupId:[data.pb.groupId._id],
      outletId:[data.pb.outletId._id],
      validFrom:[data.pb.validFrom],
      validTo:[data.pb.validTo],
      file: ['']
    });    
    this.action = data.action;
  }

  ngOnInit(): void {
    this.utilService.get('customers/group', {mode: 'customer'}).subscribe(result => {
      this.customerGroups = result.body;
      let all_customers: ICustomerGroup = {_id: '0', name: 'All Customers'};
      this.customerGroups.unshift(all_customers);
    });

    this.utilService.get('sell/outlet', {}).subscribe(result => {
      this.outlets = result.body;
      let all_outlets: IOutlet = {_id: '0', name: 'All Outlets'};
      this.outlets.unshift(all_outlets);
    });
  }

  doAction(){
    if(this.bookForm.valid){      
      const formData = this.bookForm.value;
      formData.private_web_address = this.data.user.private_web_address;      
      if(this.data.action==='edit'){
        //TODO: save changed payment
        formData._id = this.data.pb._id;
        this.utilService.put('product/price_book', formData).subscribe((result) => {                    
          this.toastService.callbackSuccessSave(result, 'Price book', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
      else if(this.data.action==='add'){
        //TODO: add new payment        
        this.utilService.post('product/price_book', formData).subscribe(result => {
          this.toastService.callbackSuccessSave(result, 'Price book', () => {this.dialogRef.close(result)});
        }, error => {this.toastService.showFailedSave(error)});
      }
    }
  }

  get nameInput(): any {return this.bookForm.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  chooseFile(files:any) {
    this.bookFile = files[0];
  }

  downloadBookFile(filename) {
    this.utilService.get_csvfile(filename);
  }

}
