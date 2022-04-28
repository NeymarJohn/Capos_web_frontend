import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { Constants } from '@app/_configs/constant';
import { Producttype } from '@app/_classes/producttype.class';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-type-dlg',
  templateUrl: './type-dlg.component.html',
  styleUrls: ['./type-dlg.component.scss']
})
export class TypeDlgComponent implements OnInit {
  util = UtilFunc;
  form: FormGroup;
  type: Producttype = null;
  touch: boolean = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<TypeDlgComponent>,
    private fb: FormBuilder,
    private toastService: ToastService    
  ) {
    this.type = data.type;
    this.touch = this.type.data.touch;
    this.form = this.fb.group({
      name:[this.type.data.name, [Validators.required]],
      slug:[this.type.data.slug, [Validators.required]],
      description:[this.type.data.description],
    });  
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){
      this.type.loadDetails(this.form.value);
      this.type.data.touch = this.touch;
      this.type.save((result) => {        
        this.toastService.callbackSuccessSave(result, 'Product Type', () => {this.dialogRef.close(result)});
      }, error => {
        this.toastService.showFailedSave(error)
      })
    }
  }

  onChangeName() {
    let name = this.form.get('name').value, slug = '';
    if(name) {
      slug = this.util.getSlug(name);
    }
    this.form.get('slug').setValue(slug);
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get slugInput(): any {return this.form.get('slug'); }
  get slugInputError(): string {
    if (this.slugInput.hasError('required')) {return Constants.message.requiredField; }    
  }

}
