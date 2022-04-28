import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { ContinueSaleComponent } from './continue-sale/continue-sale.component';
import { ProcessReturnComponent } from './process-return/process-return.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    component: AllComponent,
    data: {title: 'All - Sales History'}
  },
  {
    path: 'process-return',
    component: ProcessReturnComponent,
    data: {title: 'Process - Sales History'}
  },
  {
    path: 'continue-sale',
    component: ContinueSaleComponent,
    data: {title: 'Contiune - Sales History'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesHistoryRoutingModule { }
