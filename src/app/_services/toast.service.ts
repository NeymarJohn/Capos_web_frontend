import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { Constants } from 'src/app/_configs/constant';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastService: ToastrService) { }
  showSuccess(msg:string, title:string='Success'): any {
    this.toastService.success(msg, title);
  }

  showFailed(msg:string, title:string='Failed'): any {
    this.toastService.error(msg, title);
  }

  showWarning(msg:string, title:string='Warning'): any {
    this.toastService.warning(msg, title);
  }

  showSuccessSave() {
    this.toastService.success(Constants.message.successSaved, 'Success');
  }

  showSuccessUpload() {
    this.toastService.success(Constants.message.successUpload, 'Success');
  }

  showSuccessRemove() {
    this.toastService.success(Constants.message.successRemoved, 'Success');
  }

  showFailedSave(error?:any) {    
    this.toastService.error(Constants.message.failedSave, 'Error');
  }

  showFailedRemove() {
    this.toastService.error(Constants.message.failedRemove, 'Error');
  }

  showFailedUpload() {
    this.toastService.error(Constants.message.failedUpload, 'Error');
  }

  showWarningDuplicate(item: string) {
    this.toastService.warning(Constants.message.duplicateItem.replace('?', item), 'Warning');
  }

  callbackSuccessSave(result, item:string='', cb:any, show_success_message:boolean = true) {
    if(result.body.status && result.body.status == 'already_exist' && item) {
      this.showWarningDuplicate(item);
    } else {      
      if(show_success_message) this.showSuccessSave();
      if(cb) cb();
    }
  }
}
