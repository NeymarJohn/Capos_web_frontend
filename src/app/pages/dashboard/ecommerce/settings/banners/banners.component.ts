import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';
import { IBanner } from '@app/_classes/store.class';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { StoreConstants } from '@app/_configs/constant';

@Component({
  selector: 'app-banners-setting',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  
  uploading:boolean = false;  
  banners:IBanner[] = [];
  recommended_size = ['500 x 500px', '500 x 300px', '500 x 300px', '500 x 240px'];

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private utilService: UtilService,
    public store: Store
  ) {
    this.store.load(() => {
      if(this.store.banners.length > 0) {
        this.banners = this.store.banners;
      } else {
        this.banners = StoreConstants.default_banners;
      }
    });
  }

  ngOnInit(): void {
    
  }

  addBanner() {
    let banner:IBanner = {
      title: '',
      subtitle: '',
      button: '',
      href: '',
      image: ''
    }
    this.banners.push(banner);
  }

  removeBanner(index: number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Banner'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {    
        if(this.banners[index].image) {
          this.removeImage(this.banners[index].image, index);
        }
        this.banners.splice(index, 1);
      }
    });
  }

  save() {
    this.store.banners = [...this.banners];    
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  uploadFile(files: any, index:number): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {
      this.banners[index].image = result.body.path;
      this.uploading = false;
    }, error => {
      this.uploading = false;
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }

  getImagePath(path:string, index: number) {           
    return this.utilService.get_banner_image(path, index);
  }

  removeImage(path:any, index:number) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {      
      this.banners[index].image = '';      
      this.uploading= false;
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

}
