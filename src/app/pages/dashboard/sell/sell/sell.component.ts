import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from '@service/util.service';
import {AuthService} from '@service/auth.service';
import {ToastService} from '@service/toast.service';
import {MatDialog} from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {DiscountDlgComponent} from '@page/dashboard/sell/sell/discount-dlg/discount-dlg.component';
import {PasswordDlgComponent} from '@page/dashboard/sell/sell/password-dlg/password-dlg.component';
import {NoteDlgComponent} from '@page/dashboard/sell/sell/note-dlg/note-dlg.component';
import {HoldDlgComponent} from '@page/dashboard/sell/sell/hold-dlg/hold-dlg.component';
import {AddCustomerDlgComponent} from '@page/dashboard/sell/sell/add-customer-dlg/add-customer-dlg.component';
import {UnfulfilledDlgComponent} from '@page/dashboard/sell/sell/unfulfilled-dlg/unfulfilled-dlg.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {VariantsDlgComponent} from '@page/dashboard/sell/sell/variants-dlg/variants-dlg.component';
import {ConfirmDlgComponent} from '@layout/confirm-dlg/confirm-dlg.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as UtilFunc from '@helper/util.helper';
import { Constants } from '@app/_configs/constant';
import { Producttype } from '@app/_classes/producttype.class';
import { CartProduct } from '@app/_classes/cart_product.class';
import { Cart } from '@app/_classes/cart.class';
import { Product } from '@app/_classes/product.class';
import { Customer } from '@app/_classes/customer.class';
import { Openclose } from '@app/_classes/openclose.class';
import { PopoverContentComponent } from 'ngx-smart-popover';
import { ProductDataSource } from '@app/_services/product.datasource';
import { CustomerDisplayComponent } from './customer-display/customer-display.component';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})

export class SellComponent implements OnInit, AfterViewInit {
  cart: Cart;
  openClose: Openclose;
  keyword: string = '';
  addedCustomer: Customer;  
  selectedType: Producttype;
  producttypes:Producttype[] = [];
  showNote = false;
  user: any;
  store_info: any;
  cartForm: FormGroup;
  payStep = 1;
  util = UtilFunc;
  customers:Customer[] = [];
  allow_discount: boolean = false;
  passed_password: boolean = false;
  parked_sales = [];
  bLoad_parked_sales:boolean = true;
  bLoad_sales:boolean = true;
  payForm: FormGroup;
  registerForm: FormGroup;
  send_email:boolean = true;
  productDatasource: ProductDataSource;
  sort = {field:'name', order:1};

  @ViewChild(NgSelectComponent) selProduct: NgSelectComponent;
  @ViewChild("parkedSales") parkedSales : PopoverContentComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(CustomerDisplayComponent) customerDisplay: CustomerDisplayComponent;
  
  constructor(
    private dialog: MatDialog,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: ActivatedRoute,
    private fb: FormBuilder    
  ) {    
    this.authService.checkPremission('sell');

    this.authService.currentUser.subscribe(user => {        
      this.user = user;     
      if(user.role){
        this.allow_discount = user.role.permissions.includes('apply_discounts');      
      }
    });    

    this.utilService.get('auth/store', {}).subscribe(result => {      
      this.store_info = result.body;      
    })

    this.payForm = this.fb.group({
      amountToPay: ['', [Validators.min(0), Validators.max(100)]],
      amountToReturn: ['', [Validators.min(-100), Validators.max(0)]]
    });

    this.registerForm = this.fb.group({      
      open_value: ['1', [Validators.required, Validators.min(1)]],
      open_note: ['']
    });

    this.productDatasource = new ProductDataSource(this.authService, this.utilService);    
  }

  ngOnInit(): void {        
    this.cart = new Cart(this.authService, this.utilService);
    this.openClose = new Openclose(this.authService, this.utilService);
    this.initProducttypes();
    this.getCustomers();
    this.loadOpenclose();
  }

  ngAfterViewInit() {    
    this.paginator.page
      .subscribe(
        (value:PageEvent) => {
          this.searchProducts();
        }
      );
  }

  loadOpenclose() {
    this.openClose.loadCurrent(() => {
      this.loadCart();
    })
  }

  public get isOpenRegister():boolean {
    if(this.openClose._id){
      return true;
    } else {
      return false;
    }
  }

  openRegister() {
    if(this.registerForm.valid) {
      const data = this.registerForm.value;
      this.openClose.open_value = data.open_value;
      this.openClose.open_note = data.open_note;
      this.openClose.save(() => {
        this.toastService.showSuccess(Constants.message.successOpenRegister);
        this.loadOpenclose();
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  initProducttypes() {
    let all = new Producttype(this.authService, this.utilService);
    this.producttypes.push(all);
    this.selectedType = all;
    all.data.name = 'All';
    let products = 0;
    this.utilService.get('product/type', {touch:true}).subscribe(result => {
      if(result && result.body) {
        for(let t of result.body) {
          let type = new Producttype(this.authService, this.utilService);
          type.loadDetails(t);
          this.producttypes.push(type);
          products += type.data.products;
        }
        all.data.products = products;
        this.searchProducts();
      }
    })
  }
  
  searchProducts() {      
    if(this.cart.user.outlet) {      
      let filter = {range: 'all-factor', outlet: this.cart.user.outlet._id, type: this.selectedType._id, keyword: this.keyword};
      this.productDatasource.loadProducts(filter, this.paginator.pageIndex, this.paginator.pageSize, this.sort.field, this.sort.order);        
    }
  }

  applyFilter() {
    this.paginator.pageIndex = 0;    
    this.searchProducts();
  }

  clearKeyword() {
    this.keyword = '';
    this.searchProducts();
  }

  resort() {
    this.sort.order *= -1;
    this.applyFilter();
  }

  reloadOriginProducts(callback:Function) {
    let _ids = [];
    for(let cp of this.cart.products) {
      _ids.push(cp.product_id);
    }
    const data = {range: 'cart_products', _ids: _ids.join(',')};
    this.utilService.get('product/product', data).subscribe(result => {        
      if (result && result.body) {
        const products = result.body;
        products.forEach(product => {
          let index = this.cart.products.findIndex(item => item.product_id == product._id);
          if(index>-1) {
            let cp = this.cart.products[index];
            if(cp.product.data.variant_inv) {
              cp.product.data.variant_products = product.variant_products;
            } else {
              cp.product.data.inventory = product.inventory;
            }
          }
        });        
      }
      callback();
    });
  }

  checkProductsInventory(callback) {
    this.reloadOriginProducts(() => {
      for(let product of this.cart.products) {
        if(product.tracking_inv) {
          if (product.qty > product.inventory) {
            product.qty = product.inventory;
          }
          if(product.qty == 0) {
            let index = this.cart.products.findIndex(item => item.product_id == product.product_id && item.variant_id == product.variant_id);
            this.cart.products.splice(index, 1);
          }          
        }
      }
      callback();
    })
  }

  getCustomers(): void {
    this.utilService.get('customers/customer').subscribe(result => {
      if(result && result.body) {
        for(let c of result.body){          
          const customer = new Customer(this.authService, this.utilService);          
          customer.loadDetails(c);
          this.customers.push(customer);
        }
      }
    });
  }

  loadCart(): void {    
    this.bLoad_sales = false;
    this.router.queryParams.subscribe(query => {
      let id_sale = '';
      let cart_mode = 'new';
      if (query && query._id) id_sale = query._id;
      if (query && query.action) cart_mode = query.action;
      this.cart.loadCurrent(result => {        
        if(id_sale) {
          this.cart.loadFromSale(id_sale, sale_data=>{                        
            this.confirmHold(this.cart, () => {                               
              this._loadFromSale(sale_data, cart_mode);
              this.bLoad_sales = true;
            }, () => {
              this.initCart();
              this.bLoad_sales = true;
            })
          }, () => {
            this.initCart();
            this.bLoad_sales = true;
          })
        } else {
          this.initCart();
          this.bLoad_sales = true;
        }
      }, () => {
        if(id_sale) {
          this.cart.loadFromSale(id_sale, sale_data => {
            this._loadFromSale(sale_data, cart_mode);
            this.bLoad_sales = true;
          }, () => {
            this.initCart();
            this.bLoad_sales = true;
          })
        } else {
          this.initCart();
          this.bLoad_sales = true;
        }
      })    
    });
  }

  private _loadFromSale(sale_data:any, cart_mode:string) {    
    let is_new_return:boolean = false;
    sale_data.origin_status = sale_data.sale_status;
    if((!sale_data.cart_mode || sale_data.cart_mode=='new') && cart_mode == 'return') {
      sale_data.cart_mode = cart_mode;
      is_new_return = true;      
      sale_data.origin_sale_number = sale_data.sale_number;
      if(sale_data.customer){
        sale_data.origin_customer = sale_data.customer._id;
      }
    }    
    this.cart.loadByCart(sale_data); 

    if(sale_data.cart_mode == 'return') {            
      if(is_new_return) this.cart.setRefund();      
      if(!this.cart.customer) {
        this.addCustomerToSale((customer) => {
          this.cart.customer = customer;
          this._initSaleCart(sale_data._id);
        }, () => {        
          this._initSaleCart(sale_data._id);
        })
      } else {
        this._initSaleCart(sale_data._id);
      }
    } else {
      this.initCart();
      this._deleteSale(sale_data._id, () => {
        this.cart.save();
      })
    }
  }

  _initSaleCart(id_sale:string) {
    this.initCart();
    if(this.cart.sale_status == 'parked') {
      this._deleteSale(id_sale, () => {
        this.cart.save();
      })      
    } else {
      this.cart.save();
    }
  }

  initCart() {      
    if(this.cart.customer) {
      let index = this.customers.findIndex(item => {
        return this.cart.customer && item._id == this.cart.customer._id;
      })
      if(index>-1) this.addedCustomer = this.customers[index];
    } else {
      this.addedCustomer = null;
    }
    
    if (this.cart.payment_status !== 'not paid' || this.cart.sale_status == 'on_account') {
      this.payStep = 2;
      this._setPayForm();
      if(this.cart.sale_status == 'usual') {
        if(this.cart.payment_status == 'layby' || this.cart.payment_status == 'on_account'){
          this.processCustomerBalance(this.cart.payment_status, this.cart.total_to_pay);
        } else {
          this.processCustomerCredit();  
        }        
      } else if((this.cart.origin_status == 'layby' || this.cart.origin_status == 'on_account') && 
          (this.cart.payment_status == 'layby' || this.cart.payment_status == 'on_account')) {
        this.cart.payment_status = 'not paid';
        this.payStep = 1;
      } else {
        this.processCustomerCredit();
      }
    }    
  }
  
  selCustomer() {
    if(this.addedCustomer) {
      this.cart.customer = this.addedCustomer;
    } else {
      this.cart.customer = null;
    }    
    this.cart.save();
  }

  addToCart(product:Product): void {
    if (!this.isOpenRegister || this.cart.isRefund) {
      this.toastService.showWarning('On Return Items, you can\'t add new product to cart.');
      return;
    }         
    if(product.data.variant_inv) {
      let cart_products:CartProduct[] = [];
      for(let vp of product.data.variant_products) {        
        let cart_product = new CartProduct(product, vp._id);
        cart_product.qty = this.cart.getCurrentQty(cart_product);        
        cart_products.push(cart_product);
      }
      const dialogRef = this.dialog.open(VariantsDlgComponent, {
        width: '600px',
        data: {cart_products: cart_products}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.sel_products) {
          for(let sp of result.sel_products) {   
            let cart_product = new CartProduct(product, sp.variant_id);
            this.cart.addProduct(cart_product, sp.qty);
          }
          this.cart.save();
        }        
        this.selProduct.handleClearClick();
      });
    } else {
      let cart_product = new CartProduct(product);
      this.cart.addProduct(cart_product);      
      this.cart.save();
    }
  }

  removeProduct(productNo: number): void {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Item'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        this.cart.removeProduct(productNo);
        this.cart.save();
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
      data: {discount : this.cart.discount}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cart.setGlobalDiscount();
      this.cart.save();
    });
  }

  confirmPassword(cb?:any) {
    const dialogRef = this.dialog.open(PasswordDlgComponent, {
      width: '500px',
      data: {user: this.cart.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 1) {
        this.passed_password = true;
        if(cb) cb();
      }
    });
  }

  _setPayForm() {
    if(this.cart.isRefund) {
      this.payForm = this.fb.group({
        amountToPay: [''],
        amountToReturn: [this.cart.total_to_pay, [Validators.min(this.cart.total_to_pay), Validators.max(0)]]
      });    
    } else {
      this.payForm = this.fb.group({
        amountToPay: [this.cart.total_to_pay, [Validators.min(0)]],
        amountToReturn: ['']
      });    
    }
  }

  setQty(product:CartProduct, index:number) {
    if(!product.qty) {
      this.cart.products.splice(index, 1);
    }else if(product.qty > product.inventory) {
      product.qty = product.inventory;
    }
    this.cart.save();
  }

  startPay(): void {
    for(let product of this.cart.products) {
      let index = this.cart.products.findIndex(item => item.product_id == product.product_id && item.variant_id == product.variant_id);
      if(product.qty == 0) this.cart.products.splice(index, 1);
    }
    if (!this.cart.products.length) {
      this.toastService.showWarning(Constants.message.invalidCartProducts);
      return;
    }
    this.cart.payment_status = 'start';
    this.cart.save(() => {
      this.toastService.showSuccess(Constants.message.successSaved);
    });    
  }

  pay(pay_mode: string): void { 
    if(this.cart.isRefund){
      this.refund(pay_mode);
      return;
    }
    if (this.amountToPay.value <= 0) {
      return;
    }    
    let pay_amount = this.amountToPay.value;
    if (this.payForm.valid) {   
      this.checkProductsInventory(() => {
        if(this.cart.products.length == 0) {
          this.toastService.showWarning(Constants.message.invalidCartProducts);
        } else {
          if(pay_mode == 'layby' || pay_mode == 'on_account') {
            const p = {layby: 'on Layby', on_account: 'on Account'};
            this.confirmPay(p[pay_mode], () => {
              this._pay(pay_mode, pay_amount);
            })
          } else if(pay_mode == 'store_credit'){
            if(this.addedCustomer.data.credit < pay_amount) {
              this.confirmStoreCredit(() => {
                pay_amount = this.addedCustomer.data.credit;
                this._pay(pay_mode, pay_amount);
              })
            } else {
              this._pay(pay_mode, pay_amount);
            }
          } else {
            this._pay(pay_mode, pay_amount);
          }
        }
      })
    }
  }

  refund(pay_mode: string): void {    
    if (this.amountToReturn.value >= 0) {
      return;
    }    
    let pay_amount = this.amountToReturn.value;
    if (this.payForm.valid) {         
      this._pay(pay_mode, pay_amount);
    }
  }

  private _pay(pay_mode: string, pay_amount:number) {
    this.cart.pay(pay_mode, pay_amount);
    this._setPayForm();
    this.processCustomerBalance(pay_mode, pay_amount);
    if(['cash', 'credit', 'master', 'store_credit', 'on_account'].includes(pay_mode)) {
      for(let product of this.cart.products) {
        product.updateInventory();
      }
    }
    this.cart.save();
  }

  processCustomerBalance(pay_mode:string, pay_amount:number) {
    if (this.addedCustomer) {
      if ( pay_mode === 'layby' || pay_mode === 'on_account') {
        if(this.cart.origin_status != 'layby' && this.cart.origin_status != 'on_account') {
          this.addedCustomer.temp.debit = pay_amount;
          this.addedCustomer.temp.total_spent = pay_amount;
        }
      } else if(pay_mode == 'store_credit') {                
        if(this.cart.isRefund) {
          this.addedCustomer.temp.credit = Math.abs(pay_amount);
          this.addedCustomer.temp.total_issued = Math.abs(pay_amount);          
        } else {
          this.addedCustomer.temp.credit = -pay_amount;
          this.addedCustomer.temp.total_redeemed = Math.abs(pay_amount);
        }
      }
    }
  }

  processCustomerCredit() {
    if(this.addedCustomer) {
      let credit = 0;
      for(let payment of this.cart.payments) {
        if(payment.type == 'store_credit') {
          credit += payment.amount;
        }
      }      
      if(this.cart.isRefund) {
        this.addedCustomer.temp.credit = Math.abs(credit);
        this.addedCustomer.temp.total_issued = Math.abs(credit);
      } else {
        this.addedCustomer.temp.credit = -credit;
        this.addedCustomer.temp.total_redeemed = Math.abs(credit);
      }
    }
  }

  checkValidCart(cart:Cart) {
    if(cart.products.length == 0) {
      this.toastService.showWarning(Constants.message.invalidCartProducts);
      return false;
    }
    return true;
  }

  newCart() {
    this.payStep = 1;
    this.addedCustomer = null;   
    setTimeout(() => {
      this.applyFilter();
    })
    this.cart.init();
  }

  parkSale(cart?:Cart, callback?:Function) {
    if(!cart) cart = this.cart;
    if(!this.checkValidCart(cart)) {
      return false;
    }
    const dialogRef = this.dialog.open(NoteDlgComponent, {
      width: '500px',
      data: {item: 'Park', cart : cart, msg: Constants.message.sale_note.park}
    });
    dialogRef.afterClosed().subscribe(result => {     
      if(result && result == 'process') {
        this.saveToSale(cart, 'parked', callback);
      }
    });
  }

  quoteSale() {
    if(!this.checkValidCart(this.cart)) {
      return false;
    }
    const dialogRef = this.dialog.open(NoteDlgComponent, {
      width: '500px',
      data: {item: 'Quote', cart : this.cart, msg: Constants.message.sale_note.quote}
    });
    dialogRef.afterClosed().subscribe(result => {      
      if(result && result == 'process') {
        this.saveToSale(this.cart, 'quoted');
      }
    });
  }

  markUnfulfilled() {
    if(!this.checkValidCart(this.cart)) {
      return false;
    }
    const dialogRef = this.dialog.open(UnfulfilledDlgComponent, {
      width: '620px',
      data: {user: this.user, customers: this.customers, cart: this.cart}
    });
    dialogRef.afterClosed().subscribe(result => {      
      if(result && result == 'process') {
        let mode = this.cart.fulfillment.mode, status = mode + '_unfulfilled';
        this.saveToSale(this.cart, status);
      }
    });
  }

  saveToSale(cart:Cart=null, status?:string, callback?:Function) {    
    if(!cart) cart = this.cart;
    if(!status) status = cart.sale_status;
    if(status == 'usual') status = 'parked';
    if(status == 'completed' && (cart.payment_status == 'layby' || cart.payment_status == 'on_account')) {
      status = cart.payment_status;
    }
    cart.saveToSale(status, () => {
      this.newCart();  
      if(callback) callback();
    })
  }

  completeSale(): void {
    if(this.addedCustomer) this.addedCustomer.save();
    // if (this.addedCustomer && this.send_email) {
    //   this.emailToCustomer(this.addedCustomer.data.email);
    // } else {
      this.saveToSale(null, 'completed');
    // }
  }

  emailToCustomer(email): void{
    const data = {};
    Object.assign(data, {email, cart_id: this.cart._id});
    this.utilService.post('sell/email', data).subscribe(result => {
      this.saveToSale(null, 'completed');
    });
  }

  discardSale() {
    if(this.cart.products.length == 0 && !this.cart._id) {
      return;
    }
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'sale'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        this.cart.delete(() => {
          this.toastService.showSuccessRemove();
          this.newCart();
        })
      }
    });
  }

  loadParkedSales(){
    const data={user_id: this.user._id, private_web_address: this.user.private_web_address, sale_status:'parked'};
    this.bLoad_parked_sales = false;
    this.utilService.get('sale/sale', data).subscribe(result => {
      this.parked_sales = result.body;
      this.bLoad_parked_sales = true;
    })
  }

  getParkedSaleLable(sale:any) {
    let labels = [];
    for(let product of sale.products) {
      let s = product.qty + ' x ' + product.product_name;
      if(product.variant_name) {
        s += ' <small>' + product.variant_name + '</small>';
      }
      labels.push(s);
      if(labels.length == 2 && sale.products.length>2) {        
        labels.push('and ' + (sale.products.length - 2) + ' more products');
        break;
      }
    }
    return labels;
  }

  retrieveSale(sale: any): void {    
    this.parkedSales.hide();   
    if(!this.cart._id) {
      this._retrieveSale(sale);
    } else {
      this.confirmHold(null, () => {
        const _sale = {...sale};
        this._retrieveSale(_sale);
      })
    }
  }

  private _retrieveSale(sale: any): void {    
    this.newCart();
    const cart = {...sale};
    if(sale.customer){
      cart.customer = sale.customer._id;
    }
    this.cart.loadByCart(cart);
    this.initCart();
    this._deleteSale(sale._id, () => {
      this.cart.save();
    })  
  }

  private _deleteSale(_id:string, callback:any=null) {
    this.utilService.delete('sale/sale?_id=' + _id).subscribe(result => {			
      if(callback) callback();
		}, error => {
			this.toastService.showFailedSave();	
		});
  }

  confirmHold(cart?:Cart, processCallback?:Function, closeCallback?:Function) {
    const dialogRef = this.dialog.open(HoldDlgComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        this.saveToSale(cart, null, processCallback)
      } else {
        if(closeCallback) closeCallback();
      }
    });
  }

  confirmPay(pay_mode:string, processCallback?:Function, closeCallback?:Function) {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Sale ' + pay_mode, 
        msg: 'Are you sure to process this sale ' + pay_mode + '?',
        ok_button: 'OK',
        cancel_button: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        processCallback();
      } else {
        if(closeCallback) closeCallback();
      }
    });
  }

  confirmStoreCredit(processCallback?:Function, closeCallback?:Function) {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '600px',
      data: {
        title: 'Pay ' + this.addedCustomer.credit_str + ' with Store Credit', 
        msg: 'You can only redeem up to the value of your current store credit balance. You may still continue with this as a partial payment, then choose another payment method for the remaining balance.',
        ok_button: 'Make partial payment',
        cancel_button: 'Choose a different payment type'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        processCallback();
      } else {
        if(closeCallback) closeCallback();
      }
    });
  }

  addCustomerToSale(processCallback?:Function, closeCallback?:Function) {
    const dialogRef = this.dialog.open(AddCustomerDlgComponent, {
      width: '600px',
      data: {customers: this.customers}
    });
    dialogRef.afterClosed().subscribe(result => {      
      if(result && result.customer) {                
        processCallback(result.customer);
      } else {
        if(closeCallback) closeCallback();
      }
    });
  }

  resetCustomer() {
    this.addedCustomer = null;
    this.cart.customer = null;
    this.cart.save();
  }

  openCustomerDisplay(isShow:boolean) {    
    if(!this.cart._id || !this.cart.store_info.preferences.messagebox) return;    
    if(isShow) {
      this.customerDisplay.openWindow();
    } else {
      this.customerDisplay.closeWindow();
    }
  }  

  public get amountToPay() {return this.payForm.get('amountToPay');}
  public get amountToPayError() {
    if(this.amountToPay.hasError('min')) return Constants.message.invalidMinValue.replace('?', '0');
    if(this.amountToPay.hasError('max')) return Constants.message.invalidMaxValue.replace('?', this.cart.total_to_pay.toString());
  }

  public get amountToReturn() {return this.payForm.get('amountToReturn');}
  public get amountToReturnError() {
    if(this.amountToReturn.hasError('min')) return Constants.message.invalidMinValue.replace('?', this.cart.total_to_pay.toString());
    if(this.amountToReturn.hasError('max')) return Constants.message.invalidMaxValue.replace('?', '0');
  }

  get floatInput(): any {return this.registerForm.get('open_value'); }
  get floatInputError(): string | void {    
    if (this.floatInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.floatInput.hasError('min')) { return Constants.message.invalidMinValue.replace('?', Constants.open_value.min.toString()); }
  }  

  public get isCustomerScreen():boolean {    
    return this.cart && this.cart._id && this.cart.store_info.preferences.messagebox;
  }
}
