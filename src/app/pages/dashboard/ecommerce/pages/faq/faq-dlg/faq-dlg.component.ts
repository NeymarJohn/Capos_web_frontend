import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { IFaq } from '../faq.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-faq-dlg',
  templateUrl: './faq-dlg.component.html',
  styleUrls: ['./faq-dlg.component.scss']
})
export class FaqDlgComponent implements OnInit {
  util = UtilFunc;
  form: FormGroup;  
  faq: IFaq;
  editorConfig: AngularEditorConfig = {
    editable: true,
    maxHeight: '300px'
  }

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<FaqDlgComponent>,
    private fb: FormBuilder
  ) {
    this.faq = this.data.faq;  
    this.form = this.fb.group({
      question:[this.faq.question, [Validators.required]],
      answer:[this.faq.answer]
    });  
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){     
      this.faq.answer = this.form.get('answer').value;
      this.faq.question = this.form.get('question').value;
      this.dialogRef.close({faq: this.faq})
    }
  }

  get questionInput(): any {return this.form.get('question'); }
  get questionInputError(): string {
    if (this.questionInput.hasError('required')) {return Constants.message.requiredField; }    
  }

}
