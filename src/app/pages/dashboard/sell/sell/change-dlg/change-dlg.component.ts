import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-change-dlg',
  templateUrl: './change-dlg.component.html',
  styleUrls: ['./change-dlg.component.scss']
})
export class ChangeDlgComponent implements OnInit {

  current_seconds: number = 10;
  timer: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ChangeDlgComponent>,
  ) { 
  }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      if(this.current_seconds<0) {        
        this.doAction();
      }
      this.current_seconds--;      
    }, 1000);
  }

  doAction(){
    clearInterval(this.timer);
    this.dialogRef.close('process');
  }
}
