import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { PortalModule }   from '@angular/cdk/portal';
import { FormsModule }    from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';

import { ShareModule }        from '@shared/share.module';
import { NgSelectModule }     from '@ng-select/ng-select';
import { PopoverModule}       from "ngx-smart-popover";
// import { NgxBarcodeModule }  from 'ngx-barcode';
// import { BarcodeGeneratorAllModule,QRCodeGeneratorAllModule,DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';

import { SellRoutingModule }              from './sell-routing.module';
import { DiscountDlgComponent }           from './sell/discount-dlg/discount-dlg.component';
import { SellComponent }                  from './sell/sell.component';
import { PasswordDlgComponent }           from './sell/password-dlg/password-dlg.component';
import { NoteDlgComponent }               from './sell/note-dlg/note-dlg.component';
import { HoldDlgComponent }               from './sell/hold-dlg/hold-dlg.component';
import { AddCustomerDlgComponent }        from './sell/add-customer-dlg/add-customer-dlg.component';
import { UnfulfilledDlgComponent }        from './sell/unfulfilled-dlg/unfulfilled-dlg.component';
import { VariantsDlgComponent }           from './sell/variants-dlg/variants-dlg.component';
import { CustomerDisplayComponent }       from './sell/customer-display/customer-display.component';
import { NewSellComponent }               from './sell/new_sell.component';
import { QuantityDlgComponent }           from './sell/quantity-dlg/quantity-dlg.component';
import { AmountDlgComponent }             from './sell/amount-dlg/amount-dlg.component';
import { ChangeDlgComponent }             from './sell/change-dlg/change-dlg.component';
import { PriceDlgComponent }              from './sell/price-dlg/price-dlg.component';
import { MorePaymentDlgComponent }        from './sell/more-payment-dlg/more-payment-dlg.component';

import { CashManagementComponent }        from './cash-management/cash-management.component';
import { EditCashComponent }              from './cash-management/edit-cash/edit-cash.component';

import { CloseRegisterComponent }         from './close-register/close-register.component';
import { OpenRegisterComponent }          from './open-register/open-register.component';
import { SalesHistoryComponent }          from './sales-history/sales-history.component';
import { QuotedSaleComponent }            from './quoted-sale/quoted-sale.component';
import { FulfillmentsComponent }          from './fulfillments/fulfillments.component';




@NgModule({
  declarations: [
    CashManagementComponent, 
    DiscountDlgComponent, 
    SellComponent, 
    OpenRegisterComponent, 
    CloseRegisterComponent,
    SalesHistoryComponent,
    EditCashComponent,
    PasswordDlgComponent,
    UnfulfilledDlgComponent,
    NoteDlgComponent,
    HoldDlgComponent,
    AddCustomerDlgComponent,
    QuotedSaleComponent,
    FulfillmentsComponent,
    VariantsDlgComponent,
    CustomerDisplayComponent,
    NewSellComponent,
    QuantityDlgComponent,
    AmountDlgComponent,
    ChangeDlgComponent,
    PriceDlgComponent,
    MorePaymentDlgComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SellRoutingModule,
    ShareModule,
    NgSelectModule,
    PopoverModule,
    PortalModule,
    // NgxBarcodeModule,
    // BrowserModule,
    // BarcodeGeneratorAllModule,
    // QRCodeGeneratorAllModule,
    // DataMatrixGeneratorAllModule,
  ]
})
export class SellModule { }
