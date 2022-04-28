import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location} from '@angular/common';
import { Onlineorder } from '@app/_classes/onlineorder.class';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Constants } from '@app/_configs/constant';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {DiscountDlgComponent} from '@page/dashboard/sell/sell/discount-dlg/discount-dlg.component';
import {PasswordDlgComponent} from '@page/dashboard/sell/sell/password-dlg/password-dlg.component';

import { ConfirmDlgComponent } from '@page/layouts/confirm-dlg/confirm-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import { AddProductDlgComponent } from '../add-product-dlg/add-product-dlg.component';
import { Country } from '@app/_models/country';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  edit_mode:boolean = false;
  util = UtilFunc;
  frmPayment:FormGroup;
  order_status = Constants.order_status;
  payment_statuses = Constants.payment_status;
  allow_discount: boolean = false;
  passed_password: boolean = false;
  user:any;
  countries:Country[] = [];  

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    private location: Location,
    public order: Onlineorder
  ) {

    this.authService.currentUser.subscribe(user => {        
      this.user = user;     
      if(user.role){
        this.allow_discount = user.role.permissions.includes('apply_discounts');      
      }
    }); 

    this.frmPayment = this.fb.group({
      created_at: ['', [Validators.required]],
      type: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
    
    this.countries = this.utilService.countries;       

    this.order = new Onlineorder(this.authService, this.utilService);    
    this.loadOrder();
  }

  loadOrder() {
    this.route.queryParams.subscribe(query => {
      if(query && query._id) {
        this.order.loadById(query._id, () => {          
          
        }, () => {
          this.toastService.showFailed('No existing order');
          this.location.back();
        })
      } else {
        this.order.init();
      }
    });
  }

  ngOnInit(): void {
    
  }

  updateStatus() {      
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Update Order Status', 
        msg: 'Are you really want to update status of this order?',
        cancel_button: 'Cancel',
        ok_button: 'OK'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process'){
        let status_history = {
          status: this.order.status,
          created_at: (new Date()).toString()
        }        
        this.order.status_history.push(status_history);    
      }
    });
  }

  updatePaymentStatus() {        
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Update Payment Status', 
        msg: 'Are you really want to update payment status of this order?',
        cancel_button: 'Cancel',
        ok_button: 'OK'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process'){
        let status_history = {
          status: this.order.payment_status,
          created_at: (new Date()).toString()
        }        
        this.order.payment_status_history.push(status_history);
      }
    });    
  }

  addPayment() {
    if(this.frmPayment.valid) {      
      let data = this.frmPayment.value;
      this.order.pay(data.type, data.amount, data.created_at);      
      Object.keys(data).forEach(key => {
        this.frmPayment.get(key).setValue('');
      })
    }
  }

  removePayment(index:number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'payment'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete'){
        this.order.removePayment(index);
      }
    });   
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductDlgComponent, {
      width: '100%',
      data: {
        order : this.order, 
        allow_discount: this.allow_discount, 
        passed_password: this.passed_password,
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && typeof result.passed_password != 'undefined') {
        this.passed_password = result.passed_password;
      }
      if(result && result.products) {
        for(let p of result.products) {
          this.order.addProduct(p, p.qty)
        }
      }      
    });
  }

  removeProduct(index: number) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'product'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete'){        
        this.order.removeProduct(index);
      }
    });   
  }

  addDiscount(): void {
    if(!this.allow_discount) {
      this.toastService.showWarning(Constants.message.notAllowedDiscount);
      return;
    }
    if(!this.passed_password) {
      this.confirmPassword(() => {
        this._addDiscount();
      });      
    } else {
      this._addDiscount();
    }
  }

  _addDiscount() {
    const dialogRef = this.dialog.open(DiscountDlgComponent, {
      width: '500px',
      data: {discount : this.order.discount}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.order.setGlobalDiscount();
      //this.order.save();
    });
  }

  confirmPassword(cb?:any) {
    const dialogRef = this.dialog.open(PasswordDlgComponent, {
      width: '500px',
      data: {user: this.order.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 1) {
        this.passed_password = true;
        if(cb) cb();
      }
    });
  }

  setEdit(editable:boolean) {
    this.edit_mode = editable;        
    if(!editable) {
      this.loadOrder();      
    }
  }

  save() {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Update Order', 
        msg: 'Are you really want to update this order?',
        cancel_button: 'Cancel',
        ok_button: 'OK'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process'){
        this.order.save(()=>{
          this.toastService.showSuccessSave();
          this.router.navigate(['/dashboard/ecommerce/orders']);
        })
      }
    });    
  }

  goBack(){
    this.location.back();
  }
}
