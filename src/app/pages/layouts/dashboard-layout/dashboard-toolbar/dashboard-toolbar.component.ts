import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import { SwitchUserDlgComponent } from '@app/pages/layouts/switch-user-dlg/switch-user-dlg.component';
import { TimesheetDlgComponent } from '@app/pages/layouts/timesheet-dlg/timesheet-dlg.component';
import { Constants } from '@app/_configs/constant';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss']
})
export class DashboardToolbarComponent implements OnInit {
  user: any;
  user_id: string = '';

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private toastService: ToastService,
    private utilService: UtilService,
    private route: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });
  }

  ngOnInit(): void {
  }

  logout(): void {    
    if(this.user_id) {
      const data = {
        user_id: this.user_id,        
        end_date: new Date().toISOString()
      };      
      this.utilService.put('auth/timesheet', data).subscribe(result => {
        this.user_id = '';
        this.authService.logOut();
      })
    } else {
      this.authService.logOut();
    }
  }

  timeInOut() {
    const dialogRef = this.dialog.open(TimesheetDlgComponent, {
      width: '400px',
      height: 'auto',
      data: {user_id: this.user_id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action=='process') {
        if(!this.user_id){
          this.user_id = result.user_id;
        } else {
          this.user_id = '';
        }
      }
    });
  }

  switch_user() {
    const dialogRef = this.dialog.open(SwitchUserDlgComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data && data.action == 'process') {
        data.data.private_web_address = this.user.private_web_address;
        this.authService.signIn(data.data).subscribe(result => {
          if (result) {
            if (result.email_verify) {  
              this.toastService.showSuccess(Constants.message.successSwitch);
              this.route.navigateByUrl('dashboard');
            } else {
              this.toastService.showFailed(Constants.message.notVerifiedEmail);              
            }
          }
        }, error => {          
          this.toastService.showFailed(Constants.message.noExistingUser);
        });
      }        
    });
  }
}
