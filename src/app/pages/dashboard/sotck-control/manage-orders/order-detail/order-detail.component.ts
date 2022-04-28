import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {UtilService} from '@app/_services/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import * as UtilFunction from '@app/_helpers/util.helper';
import {MailDlgComponent} from '@shared/mail-dlg/mail-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '@service/toast.service';
import { Order } from '@app/_classes/order.class';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  products = [];
  util =  UtilFunction;
  status = '';

  constructor(
    private location: Location,
    private route: Router,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
  ) {
    this.order = new Order(this.authService, this.utilService);

    this.router.queryParams.subscribe(result => {
      if (result && result._id) {        
        this.utilService.get('product/order', {_id: result._id}).subscribe(result => {          
          if(result) {
            this.order.loadDetails(result.body);            
          } else {
            this.toastService.showFailed('No Existing Order');
            this.location.back();
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.initDetail();
  }

  initDetail(): void {
  }

  goBack(): void {
    this.location.back();
  }

  edit(): void {    
    if (this.order.data.type === 'purchase') {
      this.route.navigate(['/dashboard/stock-control/order-stock'], {queryParams: {_id: this.order._id, action: 'Edit'}});  
    }
    if (this.order.data.type === 'receive') {
      this.route.navigate(['/dashboard/stock-control/receive-stock'], {queryParams: {_id: this.order._id, action: 'Edit'}});  
    }
  }

  getRetailPrice(product: any): number {
    const result = parseFloat( product.supply_price) * (1 + parseFloat(product.markup) / 100);
    return result ? result : 0;
  }

  mailOrder(): void {
    const subject = 'Order #' + this.order.data.order_number + ' from ' + this.authService.getCurrentUser.private_web_address;
    const dialogRef = this.dialog.open(MailDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {action: 'email_order', subject}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.utilService.put('product/order', {field: 'mail', ...this.order, ...result.content}).subscribe(() => {
          this.status = 'sent';
          this.toastService.showSuccess('Email order sent successfully', 'Email Order');
        },  error => {
          this.toastService.showFailed('Failed to send email order', 'Email Order');
        });
      }
    });
  }
}
