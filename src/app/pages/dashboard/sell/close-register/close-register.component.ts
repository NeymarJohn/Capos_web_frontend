import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@app/_services/toast.service';
import { Openclose } from '@app/_classes/openclose.class';
import * as UtilFunc from '@helper/util.helper';
import {ConfirmDlgComponent} from '@layout/confirm-dlg/confirm-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-close-register',
  templateUrl: './close-register.component.html',
  styleUrls: ['./close-register.component.scss']
})

export class CloseRegisterComponent implements OnInit {

  util = UtilFunc;
  showCash: boolean = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    public openClose: Openclose,
    private dialog: MatDialog
  ) { 
    this.authService.checkPremission('close_register');
  }

  ngOnInit(): void {
    this.openClose.loadCurrent(() => {
    }, () => {
      this.router.navigate(['dashboard/sell/open-register']);
    })
  }

  closeRegister(){
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Close Register', 
        msg: 'Are you sure to close this register?',
        ok_button: 'OK',
        cancel_button: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        this.openClose.status = 2;        
        this.openClose.save(() => {
          this.toastService.showSuccess('Register Closed successfully.', 'Close Register');
          this.router.navigate(['dashboard/sell/open-register']);
        })
      } 
    });
    
  }
}
