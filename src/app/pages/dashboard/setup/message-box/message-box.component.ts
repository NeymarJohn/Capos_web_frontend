import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor(    
    private toastService: ToastService,
    public store: Store
  ) { }

  ngOnInit(): void {
    this.store.load(() => {
      
    })
  }

  save(item:string) {   
    this.store.preferences[item] = !this.store.preferences[item];      
    this.store.save(() => {
      this.toastService.showSuccessSave();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  getStatusString(){
    if(this.store.preferences.messagebox){
      return 'On';
    }
    else{
      return 'Off';
    }
  }
}
