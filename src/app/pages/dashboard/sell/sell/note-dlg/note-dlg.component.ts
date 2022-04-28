import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-note-dlg',
  templateUrl: './note-dlg.component.html',
  styles: [
  ]
})
export class NoteDlgComponent implements OnInit {

  form: FormGroup;
  button_label = 'Add';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<NoteDlgComponent>,
    private fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      note:[data.cart.note]
    });
    if(data.item) this.button_label = data.item + ' Sale';
  }

  ngOnInit(): void {
  }

  doAction(){
    if(this.form.valid){     
      this.data.cart.note = this.form.get('note').value;
      this.dialogRef.close('process');
    }
  }
}
