import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';
import { IService } from '@app/_classes/store.class';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { StoreConstants } from '@app/_configs/constant';

@Component({
  selector: 'app-services-setting',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  
  uploading:boolean = false;  
  services:IService[] = [];
  iconList = ['card_giftcard', 'local_shipping', 'monetization_on', 'history', 'euro_symbol', 'favorite', 'hourglass_empty', 'motorcycle', 'link',
    'account_balance', 'account_box', 'add_shopping_cart', 'alarm', 'autorenew', 'compare_arrows', 'perm_phone_msg', 'verified_user', 'touch_app',
  'reply', 'vpn_key'];

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    public store: Store
  ) {
    this.store.load(() => {
      if(this.store.services.length>0) {
        this.services = this.store.services;
      } else {
        this.services = StoreConstants.default_services;
      }
    });
  }

  ngOnInit(): void {
    
  }

  addService() {
    let service:IService = {
      name: '',
      description: '',
      icon: ''
    }
    this.services.push(service);
  }

  removeService(index: number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Service'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        this.services.splice(index, 1);
      }
    });
  }

  save() {     
    this.store.services = this.services;
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  selIcon(icon:string, index:number) {
    this.services[index].icon = icon;
  }

  searchIcon() {
    let url = 'https://klarsys.github.io/angular-material-icons/';
    window.open(url, '_blank');
  }
}
