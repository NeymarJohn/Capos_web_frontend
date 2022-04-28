import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';
import { AuthService} from '@service/auth.service';
import { StorePolicy } from '@app/_classes/store_policy.class';

@Component({
  selector: 'app-store-others',
  templateUrl: './store-others.component.html',
  styleUrls: ['./store-others.component.scss']
})
export class StoreOthersComponent implements OnInit {
  STORE_POLICY = StorePolicy;
  user: any;
  permission: boolean = true;  

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    public store_policy:StorePolicy
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        //this.permission = this.user.role.permissions.includes('manage_payment_type');
      }
    });
    this.store_policy.load();
   }

  ngOnInit(): void {

  }

  save() {
    this.store_policy.save(() => {
      this.toastService.showSuccessSave();
    })
  }
}
