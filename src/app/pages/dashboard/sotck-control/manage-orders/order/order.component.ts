import { Component, OnInit } from '@angular/core';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {UtilService} from '@app/_services/util.service';
import {AuthService} from '@app/_services/auth.service';
import * as UtilFunctions from '@helper/util.helper';
import {ToastService} from '@app/_services/toast.service';
import {ActivatedRoute} from '@angular/router';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { VariantsDlgComponent } from '@page/dashboard/sotck-control/manage-orders/variants-dlg/variants-dlg.component';
import { ConfirmDlgComponent } from '@page/layouts/confirm-dlg/confirm-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import { Order } from '@app/_classes/order.class';
import { Product } from '@app/_classes/product.class';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order:Order = null;
  form: FormGroup;
  filteredProducts:Product[] = [];
  user: any;  
  suppliers = [];
  outlets = [];  
  sticky: boolean;  
  isLoading = false;  
  reorderLoading = false;
  action: string = 'Add';

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.order = new Order(this.authService, this.utilService);
    this.order.data.type = 'purchase';
    this.router.queryParams.subscribe(query => {
      if (query && query._id) {
        this.action = 'Edit';
        this.utilService.get('product/order', {_id: query._id}).subscribe(result => {          
          if(result) {
            this.order.loadDetails(result.body);
            this.initOrder();
          } else {
            this.toastService.showFailed('No Existing Order');
            this.location.back();
          }
        })
      }
    });

    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });

    this.form = this.fb.group({
      supplier: ['', [Validators.required]],
      deliver_to: ['', [Validators.required]],
      invoice_number: [''],
      delivery_date: [''],
      order_number: [UtilFunctions.genRandomOrderString(8), [Validators.required]],
      note: [''],
      selectedProduct: null
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.initData();
  }

  initData(): void {    
    this.utilService.get('product/supplier', {}).subscribe(result => {
      this.suppliers = result.body;
      this.initOrder();
    });

    this.utilService.get('sell/outlet', {}).subscribe(result => {
      this.outlets = result.body;
      this.initOrder();
    });

    this.form.get('selectedProduct').valueChanges.pipe(
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
        this.filteredProducts = [];
      }),
      switchMap(value => this.utilService.get('product/product', {range:'search', keyword: value})
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(response => {        
        let result:any = response;
        if(result && result.body) {
          for(let p of result.body) {
            let product = new Product(this.authService, this.utilService);
            product.loadDetails(p);
            this.filteredProducts.push(product);
          }
        }
      });
    
    this.initOrder();
  }
  
  displayFn(product: Product) {
    if (product) { 
      return product.data.name; 
    }
  }

  initOrder(): void {
    let supplier = '';
    if(this.order.data.supplier) {      
      let index = this.suppliers.findIndex(item => item._id == this.order.data.supplier._id);
      if(index>-1) supplier = this.suppliers[index];
    }
    let deliver_to = '';
    if(this.order.data.deliver_to) {
      let index = this.outlets.findIndex(item => item._id == this.order.data.deliver_to._id);
      if(index>-1) deliver_to = this.outlets[index];
    }    
    this.form.get('supplier').setValue(supplier);
    this.form.get('deliver_to').setValue(deliver_to);
    this.form.get('invoice_number').setValue(this.order.data.invoice_number);
    this.form.get('delivery_date').setValue(this.order.data.delivery_date);
    this.form.get('order_number').setValue(this.order.data.order_number);
    this.form.get('note').setValue(this.order.data.note);    
  }

  goBack(): void {
    this.location.back();
  }

  addProduct(product:Product): void {
    if (!product) {
      return;
    }    
    if(product.data.variant_inv) {
      const dialogRef = this.dialog.open(VariantsDlgComponent, {
        width: '800px',
        data: {product: product, type: 'purchase'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.products) {        
          for(let p of result.products) {
            this.order.addProduct(p);
          }
        }
      });
    } else {
      this.order.addProduct(Order.getNewOrderProduct(product));
    }
    this.selectedProduct.setValue('');
  }

  removeProduct(productNo: number): void {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Item'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        this.order.removeProduct(productNo);        
      }
    });
  }

  purchaseByReorder(): void {
    const productsPurchase = [];
    this.reorderLoading = true;
    this.utilService.get('product/product', {range: 'reorder'}).subscribe(result => {
      this.reorderLoading = false;
      if(result && result.body.length > 0) {
        for(let p of result.body) {
          let product = new Product(this.authService, this.utilService);
          product.loadDetails(p);
          if(!p.variant_inv) {
            this.order.addProduct(Order.getNewOrderProduct(product));
          } else {
            for(let vp of product.data.variant_products) {
              if(vp.inventory < vp.reorder_point) {
                this.order.addProduct(Order.getNewOrderProduct(product, vp._id));
              }
            }
          }
        }
      } else {
        this.dialog.open(ConfirmDlgComponent, {
          width: '500px',
          data: {
            title: 'None of your products have inventory levels below their reorder points.', 
            msg: 'This could be because your products haven’t gone below the reorder point or because a reorder point hasn’t been set.',
            ok_button: 'Got it, thanks'
          }
        });
      }
    }, error => {
      this.reorderLoading = false; 
    })
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    let valid_products = 0;
    for(let p of this.order.data.products) {
      if(p.qty>0) valid_products++;
    }
    if(!valid_products) {
      this.toastService.showFailed('Please add at least a product');
      return;
    }
    const data = this.form.value;
    Object.keys(data).forEach(key => {
      if(key != 'selectedProduct') this.order.data[key] = data[key];
    });    
    this.order.save(() => {
      this.toastService.showSuccessSave();
      this.location.back();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  saveAndReceive(): void {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Receive Stock', 
        msg: 'Are you really want to receive this stock?',
        ok_button: 'Receive'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process'){
        this.order.data.status = 'received';
        this.submit();
      }
    });
  }

  scroll = (event: any): void => {
    const num = event.srcElement.scrollTop;
    this.sticky = num > 64;
  }

  public get selectedProduct() {return this.form.get('selectedProduct');}
  public get supplierInput() {return this.form.get('supplier')}
  public get supplierInputError() {
    if(this.supplierInput.hasError('required')) return Constants.message.requiredField;
  }
  public get deliverToInput() {return this.form.get('deliver_to')}
  public get deliverToInputError() {
    if(this.deliverToInput.hasError('required')) return Constants.message.requiredField;
  }

  public get orderNumberInput() {return this.form.get('order_number')}
  public get orderNumberInputError() {
    if(this.orderNumberInput.hasError('required')) return Constants.message.requiredField;
  }
}
