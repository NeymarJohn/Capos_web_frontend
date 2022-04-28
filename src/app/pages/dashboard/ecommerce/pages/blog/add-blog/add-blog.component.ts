import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {MatDialog} from '@angular/material/dialog';
import {UtilService} from '@app/_services/util.service';
import {ToastService} from '@app/_services/toast.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import { APP_CONSTANTS, Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { Store } from '@app/_classes/store.class';
import { IBlog } from '../blog.component';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddBlogComponent implements OnInit {
  util = UtilFunc;
  
  form: FormGroup;  
  blog: IBlog = {
    _id: '',
    private_web_address: '',
    title: '',
    content: '',
    image: '',
    created_at:'',
    user:null
  };  

  editorConfig: AngularEditorConfig = {
    editable: true,
    toolbarHiddenButtons: [
      ['insertVideo']
    ],
    uploadUrl: APP_CONSTANTS.API_URL + 'util/file'
  };

  user: any;
  uploading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: ActivatedRoute,
    private location: Location,
    public store: Store
  ) {
    this.store.load();

    this.form = this.fb.group({
      title: ['', [Validators.required]],
      content: ['']
    });

    this.user = this.authService.getCurrentUser;

    this.router.queryParams.subscribe(query => {
      if (query && query._id) {        
        this.utilService.get('sale/blog', {_id: query._id}).subscribe(result => {
          if(result && result.body) {
            this.blog = result.body;
            this.form.get('title').setValue(this.blog.title);
            this.form.get('content').setValue(this.blog.content);
          } else {
            this.toastService.showWarning('No Existing Blog');
            this.location.back();
          }
        })        
      } 
    });
  }

  ngOnInit(): void {    
    
  }

  uploadFile(files: any): void {
    this.utilService.uploadFile(files, result => {
      this.blog.image = result.body.path;
    }, error => {
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }
  
  goBack(): void {
    this.location.back();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const data = {
      _id: this.blog._id,
      title: this.form.get('title').value,
      content: this.form.get('content').value,
      image: this.blog.image,
      user: this.blog.user?this.blog.user._id: this.user._id,
      private_web_address: this.blog.private_web_address || this.user.private_web_address
    };
    this.uploading = true;
    if(!this.blog._id) {
      delete data._id;
      this.utilService.post('sale/blog', data).subscribe(result => {
        this.uploading = false;
        this.toastService.showSuccessSave();
        this.goBack();
      }, error => {
        this.uploading = false;
        this.toastService.showFailedSave();
      })
    } else {
      this.utilService.put('sale/blog', data).subscribe(result => {
        this.uploading = false;
        this.toastService.showSuccessSave();
        this.goBack();
      }, error => {
        this.uploading = false;
        this.toastService.showFailedSave();
      })
    }
  }

  removeImage(path:any) {    
    this.uploading = true;
    this.utilService.deleteFile(path, result => {
      this.blog.image = '';
      this.uploading = false;
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

  getImagePath(path:string) {    
    return this.utilService.get_image(path);
  }

  get titleInput(): any {return this.form.get('title'); }
  get titleInputError(): string {
    if (this.titleInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
