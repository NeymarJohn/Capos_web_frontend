import { Component, OnInit, ViewChild } from '@angular/core';
import { Color } from '@angular-material-components/color-picker';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';
import { Constants, StoreConstants } from '@app/_configs/constant';
import { Router } from '@angular/router';
import { UiSwitchComponent } from 'ngx-ui-switch';
import { ConfirmDlgComponent } from '@app/pages/layouts/confirm-dlg/confirm-dlg.component';
import { MatDialog } from '@angular/material/dialog';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  
  logo: string = '';
  uploading = false;
  theme_color: Color = this.getColorFromHex(StoreConstants.theme_color);
  util = UtilFunc;
  @ViewChild('activeControl') activeControl:UiSwitchComponent;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService,
    private utilService: UtilService,
    public store: Store
  ) {
    this.store.load(() => {
      if(this.store.theme_color) {
        this.theme_color = this.getColorFromHex(this.store.theme_color);
      }
    });
  }

  ngOnInit(): void {
    
  }

  public get free_plan():boolean {
    return this.store.plan.id == 'free' || !this.store.plan.id;
  }

  setActive(new_status) {    
    if(new_status) {
      if(!this.store.active && this.free_plan) {
        const dialogRef = this.dialog.open(ConfirmDlgComponent, {
          width: '500px',
          data: {
            title: 'Confirm Subscriptions', 
            msg: 'Upgrade your plan to publish your store.',
            ok_button: 'OK',
            cancel_button: 'Cancel'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result && result == 'process') {        
            this.updatePlan();
          } 
        });
        this.activeControl.checked = false;
        return;
      }
    }        
    this.store.active = !this.store.active;
    this.save();
  }

  save() { 
    this.store.theme_color = this.theme_color.hex;
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  uploadFile(files: any, type:string): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {
      this.store[type] = result.body.path;
      this.uploading = false;
      this.store.save();
    }, error => {
      this.uploading = false;
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }

  getImagePath(path:string) {    
    return this.utilService.get_image(path);
  }

  removeImage(path:any, type:string) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {            
      this.store[type] = null;
      this.uploading= false;
      this.store.save();
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

  getColorFromHex(hex:string):Color {
    var aRgbHex = hex.match(/.{1,2}/g);  
    var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16)
    ];
    return new Color(aRgb[0], aRgb[1], aRgb[2]);
  }

  updatePlan() {
    this.router.navigate(['dashboard/setup/account']);
  }

}
