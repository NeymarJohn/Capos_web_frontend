import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Aboutpage, ITeamMember } from '@app/_classes/aboutpage.class';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { Store } from '@app/_classes/store.class';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-ecommerce-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  sticky: boolean;    
  uploading: boolean = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    toolbarHiddenButtons:[
      ['insertImage', 'insertVideo']
    ]
  }

  constructor(
    private dialog: MatDialog,
    private utilService: UtilService,
    private toastService: ToastService,
    public aboutpage:Aboutpage,
    public store: Store
  ) {
    this.store.load();
    this.aboutpage.load();    
  }

  addMember() {
    let member: ITeamMember = {
      name: '',
      job: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      photo: ''
    };
    this.aboutpage.team_members.push(member);
  }

  removeMember(index: number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Member'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {      
        if(this.aboutpage.team_members[index].photo) {
          this.removePhoto(this.aboutpage.team_members[index].photo, index);
        }
        this.aboutpage.team_members.splice(index, 1);
      }
    });
  }

  save() {
    this.store.save();
    this.aboutpage.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  ngOnInit(): void {
    
  }

  uploadImage(files:any) {
    this.uploadFile(files, path => {
      this.aboutpage.image = path;
    })
  }

  removeImage(path) {
    this.removeFile(path, () => {
      this.aboutpage.image = '';      
    })
  }

  uploadPhoto(files:any, index:number) {
    this.uploadFile(files, path => {
      this.aboutpage.team_members[index].photo = path;
    })
  }

  removePhoto(path, index:number) {
    this.removeFile(path, () => {
      this.aboutpage.team_members[index].photo = '';
    })
  }

  uploadFile(files: any, callback?:Function): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {      
      this.uploading = false;      
      if(callback) callback(result.body.path);
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

  removeFile(path:any, callback?:Function) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {            
      this.uploading= false;
      if(callback) callback();
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }
}
