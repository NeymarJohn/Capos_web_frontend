import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

import { SettingsRoutingModule } from './settings-routing.module';
import { GeneralComponent } from './general/general.component';
import { TaxesComponent } from './taxes/taxes.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { ClickCollectComponent } from './click-collect/click-collect.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SlidersComponent } from './sliders/sliders.component';
import { BannersComponent } from './banners/banners.component';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
    GeneralComponent, 
    TaxesComponent, 
    PaymentMethodsComponent, 
    ClickCollectComponent,
    SlidersComponent,
    BannersComponent,
    ServicesComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    SettingsRoutingModule,
    UiSwitchModule,
    MaterialFileInputModule,
    NgxMatColorPickerModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
})
export class SettingsModule { }
