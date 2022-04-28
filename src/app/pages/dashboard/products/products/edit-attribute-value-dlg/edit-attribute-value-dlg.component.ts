import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-edit-attribute-value-dlg',
  templateUrl: './edit-attribute-value-dlg.component.html',
  styleUrls: ['./edit-attribute-value-dlg.component.scss']
})
export class EditAttributeValueDlgComponent implements OnInit {
  form: FormGroup;
  util = UtilFunc;  
  group = {};
  requiredField = Constants.message.requiredField;  

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditAttributeValueDlgComponent>,
    private fb: FormBuilder
  ) {
    
    this.group = {};
    for(let i=0;i<this.data.variants.length;i++) {
      let name = 'value' + i;
      for(let j=0;j<this.data.variants[i].value.length;j++) {
        let name1 = name + '_' + j;
        this.group[name1] = [this.data.variants[i].value[j], [Validators.required]];
      }
    }        
    this.form = this.fb.group(this.group);
   }

  ngOnInit(): void {
  }

  getAttribute(id:any) {
    let index = this.data.attributes.findIndex(item => item._id == id);
    if(index > -1) {
      return this.data.attributes[index].name;
    }
    return '';
  }

  doAction(){
    if(this.form.valid){            
      for(let i=0;i<this.data.variants.length;i++) {
        let name = 'value' + i;
        for(let j=0;j<this.data.variants[i].value.length;j++) {
          let name1 = name + '_' + j;
          this.data.variants[i].value[j] = this.form.get(name1).value;
        }
      } 
      this.dialogRef.close({variants: this.data.variants});
    }
  }

}
