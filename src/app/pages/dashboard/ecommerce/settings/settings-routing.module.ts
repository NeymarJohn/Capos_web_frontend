import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClickCollectComponent } from './click-collect/click-collect.component';
import { GeneralComponent } from './general/general.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { SalesTaxesComponent } from '@page/dashboard/setup/sales-taxes/sales-taxes.component';
import { SlidersComponent } from './sliders/sliders.component';
import { BannersComponent } from './banners/banners.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full'
  },
  {
    path: 'general',
    component: GeneralComponent,
    data: {title: 'General - Settings - Ecommerce'}
  },
  // {
  //   path: 'taxes',
  //   component: SalesTaxesComponent,
  //   data: {title: 'Taxes - Settings - Ecommerce'}
  // },
  {
    path: 'payment-methods',
    component: PaymentMethodsComponent,
    data: {title: 'Payment Methods - Settings - Ecommerce'}
  },
  {
    path: 'click-collect',
    component: ClickCollectComponent,
    data: {title: 'Click & Collect - Settings - Ecommerce'}
  },
  {
    path: 'sliders',
    component: SlidersComponent,
    data: {title: 'Sliders - Settings - Ecommerce'}
  },
  {
    path: 'banners',
    component: BannersComponent,
    data: {title: 'Banners - Settings - Ecommerce'}
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {title: 'Services - Settings - Ecommerce'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
