import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-click-collect',
  templateUrl: './click-collect.component.html',
  styleUrls: ['./click-collect.component.scss']
})
export class ClickCollectComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    public store: Store
  ) { 
    this.store.load();
  }

  ngOnInit(): void {
  }

  save(){
    this.store.click_collect = !this.store.click_collect;
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }
}
