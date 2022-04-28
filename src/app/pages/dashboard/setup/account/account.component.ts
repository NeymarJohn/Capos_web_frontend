import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@app/_classes/store.class';
import { APP_CONSTANTS, Constants } from '@app/_configs/constant';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDlgComponent } from './payment-dlg/payment-dlg.component';
import * as UtilFunc from '@helper/util.helper';
declare var $:any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  util = UtilFunc;
  plans = Constants.plans;  
  renewal_date = '';
  basicAuth = 'Basic ' + btoa(APP_CONSTANTS.PAYPAL.CLIENT_ID + ':' + APP_CONSTANTS.PAYPAL.SECRET);  
  cancel_url = '';
  loading: boolean = true;

  constructor(
    private router: Router,
    public store_info: Store,
    private dialog: MatDialog,    
  ) {    
    this.store_info.load(() => {
      if(this.store_info.plan.subscriptionId) {
        this.getSubcriptionDetails(this.store_info.plan.subscriptionId);
      } else {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    
  }

  selectPlan(plan:any){
    const dialogRef = this.dialog.open(PaymentDlgComponent, {
      width: '500px',
      data: {
        plan: plan,
        basicAuth: this.basicAuth,
        cancel_url: this.cancel_url
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'process') {        
        if(this.cancel_url) {
          this.cancelSubscription(() => {
            this.updatePlan(plan.id, result.subscriptionId);
          })
        } else {
          this.updatePlan(plan.id, result.subscriptionId);
        }
      } 
    });
  }

  // ============Start Get Subcription Details Method============================  
  getSubcriptionDetails(subcriptionId:string) {  
    const self = this; this.cancel_url = '';
    this.loading = true;
    const xhttp = new XMLHttpRequest();      
    const url = APP_CONSTANTS.IS_PRODUCT ? 'https://api.paypal.com/v1/billing/subscriptions/' : 'https://api.sandbox.paypal.com/v1/billing/subscriptions/';
    xhttp.onreadystatechange = function () {  
      if (this.readyState === 4 && this.status === 200) {  
        const data = JSON.parse(this.responseText); 
        self.renewal_date = data.billing_info.next_billing_time;  
        const cc = data.links.find(item=>item.rel == 'cancel');
        if(cc) self.cancel_url = cc.href;
        if(data.status !== 'ACTIVE') {
          self.updatePlan('free');
        }
        self.loading = false;      
      }  
    };  
    xhttp.open('GET', url + subcriptionId, true);  
    xhttp.setRequestHeader('Authorization', this.basicAuth);  
  
    xhttp.send();  
  }  

  cancelSubscription(callback?:Function) {
    const xhttp = new XMLHttpRequest();  
    const url = this.cancel_url;
    this.loading = true; const self = this;
    xhttp.onreadystatechange = function () {  
      if (this.readyState === 4 && this.status === 204) {          
        self.loading = false;
        if(callback) callback();
      }  
    };  
    xhttp.open('POST', url); 
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('Authorization', this.basicAuth);
    xhttp.send(JSON.stringify({ "reason": "New Subscription"}));
  }

  updatePlan(plan:string, subscriptionId: string='') {
    $('.' + this.store_info.plan.id).removeClass('selected');                
    this.store_info.plan.id = plan;
    $('.' + plan).addClass('selected');
    this.store_info.plan.subscriptionId = subscriptionId;
    if(plan!= 'free') this.getSubcriptionDetails(subscriptionId);
    this.store_info.save();
  }
}
