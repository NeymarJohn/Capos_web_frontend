import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-hold-dlg',
  templateUrl: './hold-dlg.component.html',
  styles: [
  ]
})
export class HoldDlgComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<HoldDlgComponent>,
  ) { 
         
  }

  ngOnInit(): void {
  }

  doAction(){            
    this.dialogRef.close('process');
  }

  exit() {
    this.dialogRef.close();
  }
}
