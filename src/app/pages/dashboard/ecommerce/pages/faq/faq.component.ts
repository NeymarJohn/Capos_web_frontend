import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@app/_classes/store.class';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import { FaqDlgComponent } from './faq-dlg/faq-dlg.component';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';

export interface IFaq{
  _id: string,
  private_web_address: string,
  question: string,
  answer: string
}

@Component({
  selector: 'app-ecommerce-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})

export class FaqComponent implements OnInit {

  faqs:IFaq[] = [];
  constructor(
    private dialog: MatDialog,
    public store: Store,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.store.load();
    this.utilService.get('sale/faq', {}).subscribe(result => {
      if(result && result.body) {
        this.faqs = result.body;
      }
    })
  }

  ngOnInit(): void {
    
  }

  add() {
    let faq:IFaq = {
      _id: '',
      question: '',
      answer: '',
      private_web_address: this.store.private_web_address
    }
    const dialogRef = this.dialog.open(FaqDlgComponent, {
      width: '700px',
      data: {faq: faq}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.faq) {      
        faq = result.faq;
        this.saveFaq(faq);
      }
    });
  }

  edit(faq: IFaq) {
    const dialogRef = this.dialog.open(FaqDlgComponent, {
      width: '700px',
      data: {faq: faq}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.faq) {      
        faq = result.faq;
        this.saveFaq(faq);
      }
    });
  }

  delete(_id: string) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'FAQ'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {    
        this.utilService.delete('sale/faq?_id=' + _id).subscribe(result => {
          let index = this.faqs.findIndex(item => item._id == _id);
          this.faqs.splice(index, 1);
          this.toastService.showSuccessRemove();
        })
      }
    });
  }

  save() {
    this.store.save(() => {
      this.toastService.showSuccessSave();
    });
  }

  saveFaq(faq:IFaq) {
    if(faq._id) {
      this.utilService.put('sale/faq', faq).subscribe(result => {
        this.toastService.showSuccessSave();
        let index = this.faqs.findIndex(item => item._id == faq._id);
        if(index>-1) this.faqs[index] = faq;
      }, error => {
        this.toastService.showFailedSave();
      })
    } else {
      delete faq._id;
      this.utilService.post('sale/faq', faq).subscribe(result => {
        this.toastService.showSuccessSave();
        faq._id = result.body._id;
        this.faqs.push(faq);
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }
}
