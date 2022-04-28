import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@helper/auth.guard';
import { Auth2Guard } from '@helper/auth2.guard';
import { ErrorPageComponent } from '@app/pages/error/error-page.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { APP_CONSTANTS } from '@app/_configs/constant';

let routes: Routes;

if(!APP_CONSTANTS.IS_FRONT) {
  routes = [{
    path: '',
    loadChildren: () => import('./interface/interface.module').then(m => m.InterfaceModule),
    canActivate: [Auth2Guard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'online-store/:private_web_address',
    loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent
  },
  { 
    path: '**', 
    redirectTo: 'error',
    pathMatch: 'full'
  }];
} else {
  routes = [{
    path: '',
    loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent
  },
  { 
    path: '**', 
    redirectTo: 'error',
    pathMatch: 'full'
  }];
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
