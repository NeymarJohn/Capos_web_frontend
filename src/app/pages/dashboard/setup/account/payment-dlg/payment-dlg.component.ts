import {Component, Inject, OnInit, Optional, AfterViewInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as UtilFunc from '@helper/util.helper';
import { ToastService } from '@app/_services/toast.service';
import { APP_CONSTANTS } from '@app/_configs/constant';
declare var paypal;

@Component({
  selector: 'app-payment-dlg',
  templateUrl: './payment-dlg.component.html',
  styles: [
  ]
})
export class PaymentDlgComponent implements OnInit, AfterViewInit {  
  @ViewChild('paypal') paypalElement: ElementRef;
  util = UtilFunc;  
  planId:string = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PaymentDlgComponent>,
    private toastService: ToastService,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document
  ) { 
    if(data.plan.id != 'free') {
      this.planId = APP_CONSTANTS.PLANS[(data.plan.id).toUpperCase()];      
    }
  }

  ngOnInit(): void {
    
  }

  loadPaypalScript() {
    if(!window.document.getElementById('paypal-script')) {
      let script = this._renderer2.createElement('script');
      script.id = "paypal-script";
      script.src = 'https://www.paypal.com/sdk/js?client-id=' + APP_CONSTANTS.PAYPAL.CLIENT_ID + '&vault=true';
      script.type = 'text/javascript';
      if (script.readyState) {  //IE
        script.onreadystatechange = () => {        
          if (script.readyState === "loaded" || script.readyState === "complete") {
            this.loadPaypal();
          }
        };
      } else {  //Others
        script.onload = () => {
          this.loadPaypal();
        };
      }
      this._renderer2.appendChild(this._document.body, script);
    } else {
      this.loadPaypal();
    }
  }

  loadPaypal() {
    const self = this;    
    if(paypal && this.data.plan.id != 'free') {
      paypal.Buttons({  
        style: {
          layout:  'vertical',
          color:   'blue',
          shape:   'rect',
          label:   'paypal',
          size: 'responsive'
        },
        createSubscription: function (data, actions) {           
          return actions.subscription.create({  
            'plan_id': self.planId,  
          });  
        },  
        onApprove: function (data, actions) {            
          self.toastService.showSuccess('You have successfully created subscription ' + data.subscriptionID);            
          self.doAction(data.subscriptionID);
        },  
        onCancel: function (data) {  
          // Show a cancel page, or return to cart  
          console.log(data);  
        },  
        onError: function (err) {  
          // Show an error page here, when an error occurs  
          console.log(err);  
        }  
    
      }).render(this.paypalElement.nativeElement); 
    }
  }

  ngAfterViewInit() {
    this.loadPaypalScript();
  }

  doAction(subscriptionId:any=null){
    this.dialogRef.close({action: 'process', subscriptionId: subscriptionId});
  }

  exit() {
    this.dialogRef.close();
  }
}
