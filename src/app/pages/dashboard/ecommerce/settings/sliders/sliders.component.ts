import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';
import { IBanner } from '@app/_classes/store.class';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { StoreConstants } from '@app/_configs/constant';

@Component({
  selector: 'app-sliders-setting',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent implements OnInit {
  
  uploading:boolean = false;  
  sliders:IBanner[] = [];

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private utilService: UtilService,
    public store: Store
  ) {
    this.store.load(() => {
      if(this.store.sliders.length>0) {
        this.sliders = this.store.sliders;
      } else {
        this.sliders = StoreConstants.default_sliders;
      }
    });
  }

  ngOnInit(): void {
    
  }

  addSlider() {
    let slider:IBanner = {
      title: '',
      subtitle: '',
      button: '',
      href: '',
      image: ''
    }
    this.sliders.push(slider);
  }

  removeSlider(index: number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Slider'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        if(this.sliders[index].image) {
          this.removeImage(this.sliders[index].image, index);
        }
        this.sliders.splice(index, 1);
      }
    });
  }

  save() {     
    this.store.sliders = this.sliders;
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  uploadFile(files: any, index:number): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {
      this.sliders[index].image = result.body.path;
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

  getImagePath(path:string, index:number) {       
    return this.utilService.get_slider_image(path, index);
  }

  removeImage(path:any, index:number) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {      
      this.sliders[index].image = '';      
      this.uploading= false;
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

}
