import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';
import { AuthService} from '@service/auth.service';
import { Payment } from '@app/_classes/payment.class';

@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrls: ['./payment-types.component.scss']
})
export class PaymentTypesComponent implements OnInit {
  user: any;
  permission: boolean = false;
  chk_payments = Payment.PAYMENT_TYPES;

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    public payment:Payment
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('manage_payment_type');
      }
    });
    this.payment.load();
   }

  ngOnInit(): void {

  }

  getPaymentLabel(p) {
    return Payment.getPaymentLabel(p);
  }

  save() {
    this.payment.save(() => {
      this.toastService.showSuccessSave();
    })
  }
}
