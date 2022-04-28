import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';
import { AuthService} from '@service/auth.service';
import { Store } from '@app/_classes/store.class';
import { Group } from '@app/_classes/group.class';
import { UtilService } from '@app/_services/util.service';
import { Payment } from '@app/_classes/payment.class';

@Component({
  selector: 'app-customer-point-gift',
  templateUrl: './customer-point-gift.component.html',
  styleUrls: ['./customer-point-gift.component.scss']
})
export class CustomerPointGiftComponent implements OnInit {
  user: any;
  permission: boolean = true;
  chk_settings = Store.CUSTOMER_POINT_GIFT;
  groups:Group[] = [];
  payment: Payment;
  active_payments:string[] = [];
  point_rates = [];

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private utilService: UtilService,
    public store:Store
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        // this.permission = this.user.role.permissions.includes('manage_payment_type');
      }
    });
    this.store.load();
    this.payment = new Payment(this.authService, this.utilService);
   }

  ngOnInit(): void {
    this.utilService.get('customers/group', {}).subscribe(result => {
      if(result && result.body) {
        for(let g of result.body) {
          let group = new Group(this.authService, this.utilService);
          group.loadDetails(g);
          this.groups.push(group);
        }        
        this.payment.load(() => {
          for(let s of this.payment.payments) {
            if(!['layby', 'store_credit', 'on_account'].includes(s)) {
              this.active_payments.push(s);
            }
          }
        });
      }
    })
  }

  getPaymentLabel(p:string) {
    return Payment.getPaymentLabel(p);
  }

  save() {
    this.store.save(() => {      
      this.toastService.showSuccessSave();
      for(let g of this.groups) {
        g.save();
      }
    })
  }
}
