import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { APP_CONSTANTS } from '@app/_configs/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public ipAddress = new BehaviorSubject('');
  public currentUser: BehaviorSubject<User>;
  constructor(
    public jwtHelper: JwtHelperService,
    private route: Router,
    private http: HttpClient,
    private toastService: ToastrService
  ) {
    this.currentUser = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.getIpAddress();
  }

  setToken(token:string): any {
    localStorage.setItem('token', token);
  }

  public get getCurrentUser(): User {
    return this.currentUser.value;
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  getUrl(uri): string {
    return APP_CONSTANTS.API_URL + uri;
  }

  getIpAddress(): any {
    this.http.get('https://jsonip.com').subscribe((res: any) => {
      this.ipAddress.next(res.ip);
    });
  }


  signUp(user): any {
    return this.http.post(this.getUrl('auth/register'), user);
  }

  signIn(user): any {
    console.log(this.getUrl('auth/login'))
    return this.http.post(this.getUrl('auth/login'), user).pipe(map(
      (result: any) => {
        if(!result.error && result.token) {
          const decoded = this.jwtHelper.decodeToken(result.token);          
          this.setCurrentUser(decoded);
          this.setToken(result.token);
          return {error: 0, token:decoded};
        } else {
          return result;
        }
      }
    ));
  }

  forgotPassword(user): any {    
    return this.http.post(this.getUrl('auth/forgot_password'), user);
  }

  setCurrentUser(user:any): void {
    this.currentUser.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn(): any {
    const token = localStorage.getItem('token');
    return (token !== 'undefined' && token !== null && !this.jwtHelper.isTokenExpired());
  }

  logOut(): void {
    let user = this.getCurrentUser;
    const data = {
      user_id: user._id,
      end_date: new Date().toISOString()
    };
    this.http.put(this.getUrl('auth/timesheet'), data).subscribe(result => {
      localStorage.removeItem('token');
      this.route.navigateByUrl('');
    });
  }

  checkPremission(page:string) {
    let page_permissions = {
      'sell' : ['make_sales', 'perform_sale'],
      'close_register' : ['close_registers'],
      'sales_history' : ['make_sales'],
      'quoted' : ['make_sales'],
      'cash_management' : ['perform_cash'],
      'sales_ledger' : ['perform_sale', 'void_sales', 'issue_store_credit'],
      'sales_report' : ['view_sales'],
      'payment_report' : ['view_reporting'],
      'regiser_closure' : ['view_sales', 'close_registers'],
      'manage_order': ['perform_supplier', 'perform_stock', 'perform_inventory'],
      'setup_general' : ['manage_keys']
    }
    let user = this.getCurrentUser;    
    let f:boolean = true;
    if(user.role) {
      for(let p of page_permissions[page]) {
        if(!user.role.permissions.includes(p)) {
          f = false;
          break;
        }
      }
    } else {
      f = false;
    }
    
    if(!f) {
      this.toastService.warning('You have no permission for this page', 'Warning');
      this.route.navigate(['/dashboard/home']);
    }
  }
}
