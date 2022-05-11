import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '@service/util.service';
import { AuthService } from '@service/auth.service';
import { ToastService } from '@service/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscountDlgComponent } from '@page/dashboard/sell/sell/discount-dlg/discount-dlg.component';
import { PasswordDlgComponent } from '@page/dashboard/sell/sell/password-dlg/password-dlg.component';
import { NoteDlgComponent } from '@page/dashboard/sell/sell/note-dlg/note-dlg.component';
import { HoldDlgComponent } from '@page/dashboard/sell/sell/hold-dlg/hold-dlg.component';
import { AddCustomerDlgComponent } from '@page/dashboard/sell/sell/add-customer-dlg/add-customer-dlg.component';
import { UnfulfilledDlgComponent } from '@page/dashboard/sell/sell/unfulfilled-dlg/unfulfilled-dlg.component';
import { RemoveItemDlgComponent } from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { VariantsDlgComponent } from '@page/dashboard/sell/sell/variants-dlg/variants-dlg.component';
import { ConfirmDlgComponent } from '@layout/confirm-dlg/confirm-dlg.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { QuantityDlgComponent } from './quantity-dlg/quantity-dlg.component';
import { AmountDlgComponent } from './amount-dlg/amount-dlg.component';
import { ChangeDlgComponent } from './change-dlg/change-dlg.component';
import { PriceDlgComponent } from './price-dlg/price-dlg.component';
import { IPaymentButton, Payment } from '@app/_classes/payment.class';
import { MorePaymentDlgComponent } from './more-payment-dlg/more-payment-dlg.component';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-new-sell',
  templateUrl: './new_sell.component.html',
  styleUrls: ['./new_sell.component.scss']
})

export class NewSellComponent implements OnInit, AfterViewInit {

  category_page_info = {
    page: 1,
    size: 14,
    is_prev: false,
    is_next: false
  }
  product_page_info = {
    page: 1,
    size: 28,
    is_prev: false,
    is_next: false
  }
  showProductImage: boolean = false;

  addedCustomer: Customer;
  selectedType: Producttype;
  producttypes:Producttype[] = [];
  user: any;
  util = UtilFunc;
  customers:Customer[] = [];
  allow_discount: boolean = false;
  allow_print_label: boolean = false;
  allow_view_last_tran: boolean = false;
  allow_void_sales: boolean = false;
  passed_password: boolean = false;
  parked_sales = [];
  loading_parked_sales: boolean = false;
  loading_cart:boolean = false;
  loading_register:boolean = false;
  loading_filter_product:boolean = false;
  registerForm: FormGroup;
  searchForm: FormGroup;
  send_email:boolean = true;
  productDatasource: ProductDataSource;
  filteredProducts:Product[] = [];
  last_sale: Cart = null;
  label_void_item:string = 'Void Item';
  categories = [];
  products = [];
  payment_buttons:IPaymentButton[] = [];
  more_buttons:IPaymentButton[] = [];


  /// receiptPrintTemplate
  header1: String = "";
  header1Status: Boolean = false;
  header2: String = "";
  header2Status: Boolean = false;
  header3: String = "";
  header3Status: Boolean = false;
  header4: String = "";
  header4Status: Boolean = false;
  header5: String = "";
  header5Status: Boolean = false;
  policy1: String = "";
  policy1Status: Boolean = false;
  policy2: String = "";
  policy2Status: Boolean = false;
  policy3: String = "";
  policy3Status: Boolean = false;
  policy4: String = "";
  policy4Status: Boolean = false;
  policy5: String = "";
  policy5Status: Boolean = false;
  marketing1: String = "";
  marketing1Status: Boolean = false;
  marketing2: String = "";
  marketing2Status: Boolean = false;
  marketing3: String = "";
  marketing3Status: Boolean = false;
  marketing4: String = "";
  marketing4Status: Boolean = false;
  marketing5: String = "";
  marketing5Status: Boolean = false;
  ticketPolicy: String = "";
  ticketPolicyStatus: Boolean = false;
  pole1: String = "";
  pole2: String = "";

  //////

  @ViewChild("parkedSales") parkedSales : PopoverContentComponent;
  @ViewChild(CustomerDisplayComponent) customerDisplay: CustomerDisplayComponent;
  @ViewChild('retrieve_sale') btnRetrieveSale : ElementRef;
  @ViewChild('print_tran') btnPrintTran : ElementRef;
  @ViewChild('keyword') ctrlKeyword: ElementRef;
  @ViewChild('new_sell_screen') elemScreen: ElementRef;

  constructor(
    private dialog: MatDialog,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public cart: Cart,
    public openClose: Openclose,
    public payment: Payment,
    public store: Store
  ) {
    this.payment.load(()=> {
      this.getPaymentButtons();
    });
    this.store.load();

    this.authService.checkPremission('sell');

    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(user.role){
        this.allow_print_label = user.role.permissions.includes('print_labels');
        this.allow_discount = user.role.permissions.includes('apply_discounts');
        this.allow_view_last_tran = user.role.permissions.includes('view_last_transaction');
        this.allow_void_sales = user.role.permissions.includes('void_sales');
      }
    });

    this.registerForm = this.fb.group({
      open_value: ['1', [Validators.required, Validators.min(1)]],
      open_note: ['']
    });

    this.searchForm = this.fb.group({
      keyword: null
    });

    this.productDatasource = new ProductDataSource(this.authService, this.utilService);
  }

  ngOnInit(): void {
    this.getReceiptTemplate()

    this.cart.store_info.load();
    this.loadFilteredProducts();
    this.loadCategories();
    this.loadAllCustomers();
    this.loadOpenclose();
    this.loadLastSale();
  }

  // get receipt Print template..
  getReceiptTemplate(): void {
    this.utilService.get('sell/receipttemplate', { private_web_address: this.cart.store_info.store_name }).subscribe(result => {
      if (result && result.body) {
        this.header1 = result.body.header1;
        this.header1Status = result.body.header1Status;
        this.header2 = result.body.header2;
        this.header2Status = result.body.header2Status;
        this.header3 = result.body.header3;
        this.header3Status = result.body.header3Status;
        this.header4 = result.body.header4;
        this.header4Status = result.body.header4Status;
        this.header5 = result.body.header5;
        this.header5Status = result.body.header5Status;
        this.policy1 = result.body.policy1;
        this.policy1Status = result.body.policy1Status;
        this.policy2 = result.body.policy2;
        this.policy2Status = result.body.policy2Status;
        this.policy3 = result.body.policy3;
        this.policy3Status = result.body.policy3Status;
        this.policy4 = result.body.policy4;
        this.policy4Status = result.body.policy4Status;
        this.policy5 = result.body.policy5;
        this.policy5Status = result.body.policy5Status;
        this.marketing1 = result.body.marketing1;
        this.marketing1Status = result.body.marketing1Status;
        this.marketing2 = result.body.marketing2;
        this.marketing2Status = result.body.marketing2Status;
        this.marketing3 = result.body.marketing3;
        this.marketing3Status = result.body.marketing3Status;
        this.marketing4 = result.body.marketing4;
        this.marketing4Status = result.body.marketing4Status;
        this.marketing5 = result.body.marketing5;
        this.marketing5Status = result.body.marketing5Status;
        this.ticketPolicy = result.body.ticketPolicy;
        this.ticketPolicyStatus = result.body.ticketPolicyStatus;
        this.pole1 = result.body.pole1;
        this.pole2 = result.body.pole2;
      }
    });
  }

  getPolicyStatus() : boolean {
    if (this.policy1Status || this.policy2Status || this.policy3Status || this.policy4Status || this.policy5Status) {
      return true
    } else {
      return false
    }
  }

  getMarkeingStatus() : boolean {
    if (this.marketing1Status || this.marketing3Status || this.marketing3Status || this.marketing4Status || this.marketing5Status) {
      return true
    } else {
      return false
    }
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.focusKeyword();
    })
  }

  loadFilteredProducts() {
    this.searchForm.get('keyword').valueChanges.pipe(
      debounceTime(300),
      tap(() => {
        this.loading_filter_product = true;
        this.filteredProducts = [];
      }),
      switchMap(value => this.utilService.get('product/product', {range:'search', keyword: value})
        .pipe(
          finalize(() => this.loading_filter_product = false),
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
  }

  loadLastSale() {
    const filter = {range: 'last_sale', user_id: this.user._id};
    this.utilService.get('sale/sale', filter).subscribe(result => {
      if(result && result.body.data.length==1) {
        this.last_sale = new Cart(this.authService, this.utilService);
        this.last_sale.loadByCart(result.body.data[0]);
      } else {
        this.last_sale = null;
      }
    })
  }

  displayFn(product: Product) {
    if (product) {
      return product.data.name;
    }
  }

  displayAutocomplete(product:Product) {
    let keyword = this.keyword.value.toLowerCase();
    let result = '';
    if(product.data.name.toLowerCase().includes(keyword)) {
        result = product.data.name;
    } else {
      result = product.data.barcode;
    }
    return '<span>' + result + '</span>';
  }

  public get current():any {
    let date = new Date();
    return {
      year: date.getFullYear(),
      month: ('0' + (date.getMonth() + 1)).substr(-2),
      day: ('0' + date.getDate()).substr(-2),
      hour: ('0' + date.getHours()).substr(-2),
      minute: ('0' + date.getMinutes()).substr(-2),
      second: ('0' + date.getSeconds()).substr(2)
    };
  }

  getCategories() {
    let result = [];
    let start = (this.category_page_info.page - 1) * this.category_page_info.size,
        end = (this.category_page_info.page * this.category_page_info.size);
    for(let i=start; i<end; i=i+2) {
      let rr = [];
      for(let j=0;j<2;j++) {
        if(i+j<this.producttypes.length) {
          rr.push(this.producttypes[i+j]);
        } else {
          rr.push(null);
        }
      }
      result.push(rr);
    }
    this.category_page_info.is_next = this.producttypes.length > end;
    this.category_page_info.is_prev = this.category_page_info.page > 1;
    this.categories = result;
  }

  getProducts() {
    let result = [];
    let start = 0, end = this.product_page_info.size;
    for(let i=start; i<end; i=i+4) {
      let rr = [];
      for(let j=0;j<4;j++) {
        if(i+j<this.productDatasource.data.length) {
          rr.push(this.productDatasource.data[i+j]);
        } else {
          rr.push(null);
        }
      }
      result.push(rr);
    }
    this.product_page_info.is_next = this.productDatasource.totalElements > (this.product_page_info.page * this.product_page_info.size);
    this.product_page_info.is_prev = this.product_page_info.page > 1;
    this.products = result;
  }

  public get selected_cart_product():CartProduct {
    // let result = this.cart.products.find(item => item.checked);
    let sel_cart_product = this.cart.getSelectedBundleProduct();
    return this.cart.getProductsFromBundle(sel_cart_product);
  }

  selCartProduct(product:CartProduct) {
    product.checked = !product.checked;
    this.deSelectOther(product);
  }

  deSelectOther(product:CartProduct) {
    if(product.checked) {
      this.cart.deSelectOtherBundleProducts(product);
      if(this.cart.isVoid) {
        this.label_void_item = product.void ? 'Cancel Void' : 'Void Item';
      }
    } else {
      this.label_void_item = 'Void Item';
    }
  }

  selCategory(category:Producttype) {
    this.selectedType = category;
    this.applyFilter();
  }

  removeProductFromCart() {
    if(!this.selected_cart_product) return;
    let index = this.cart.products.findIndex(item => item == this.selected_cart_product);
    if(this.cart.store_info.preferences.confirm_delete_product) {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '400px',
        data: {action: 'delete', item: 'Item'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'delete') {
          this._removeBundleProductFromCart(index);
          this.cart.save();
        }
        this.focusKeyword();
      });
    } else {
      this._removeBundleProductFromCart(index);
      this.cart.save();
      this.focusKeyword();
    }
  }

  _removeBundleProductFromCart(index:number) {
    let sel_bundle = this.cart.getSelectedBundleProduct();
    if(sel_bundle.qty == this.selected_cart_product.qty) {
      this.cart.removeProduct(index);
    } else {
      this.selected_cart_product.qty -= sel_bundle.qty;
    }
  }

  exchangeMinus() {
    if(!this.selected_cart_product) return;
    this.selected_cart_product.sign *= -1;
    this.cart.save();
  }

  updateQuantity() {
    if(!this.selected_cart_product) return;
    const dialogRef = this.dialog.open(QuantityDlgComponent, {
      width: '500px',
      data: {quantity: this.selected_cart_product.qty}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'enter') {
        let stock = this.selected_cart_product.product.getInventory(this.selected_cart_product.variant_id);
        if(stock < result.qty) {
          this.toastService.showWarning('Out of Stock');
        } else {
          if(result.qty == 0) {
            let index = this.cart.products.findIndex(item => item == this.selected_cart_product);
            this.cart.removeProduct(index);
          } else {
            this.selected_cart_product.qty = result.qty;
          }
          this.cart.save();
        }
      }
      this.focusKeyword();
    });
  }

  voidItem() {
    if(!this.selected_cart_product) return;
    this.selected_cart_product.void = !this.selected_cart_product.void;
    this.label_void_item = this.selected_cart_product.void ? 'Cancel Void' : 'Void Item';
  }

  addNote() {
    const dialogRef = this.dialog.open(NoteDlgComponent, {
      width: '500px',
      data: {cart: this.cart}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cart.save();
      this.focusKeyword();
    });
  }

  gotoCategoryPage(page:number) {
    if(page == 1 && this.category_page_info.is_next) {
      this.category_page_info.page++;
      this.getCategories();
    }
    if(page == -1 && this.category_page_info.is_prev) {
      this.category_page_info.page--;
      this.getCategories();
    }
  }

  gotoProductPage(page:number) {
    if(page == 1 && this.product_page_info.is_next) {
      this.product_page_info.page++;
      this.searchProducts();
    }
    if(page == -1 && this.product_page_info.is_prev) {
      this.product_page_info.page--;
      this.searchProducts();
    }
  }

  public get is_selectable_customer():boolean {
    if(this.cart.origin_customer!='' || this.cart.sale_status == 'on_account') return false;
    return true;
  }

  checkButtonStatus(button:string) {
    if(!this.isOpenRegister) return false;
    switch(button) {
      case 'payment_screen':
        if(!this.isCustomerScreen) return false;
        break;
      case 'print_label':
        if(!this.allow_print_label) return false;
        break;
      case 'print_last_tran':
        if(!this.allow_view_last_tran) return false;
        // if(!this.last_sale || !this.allow_view_last_tran) return false;
        break;
      case 'park_sale':
      case 'discard_sale':
        if(!this.cart.is_manage_sale || Constants.paid_status.includes(this.cart.sale_status)) return false;
        break;
      case 'quote_sale':
      case 'mark_as_unfulfilled':
        if(!this.cart.is_manage_sale || this.cart.isRefund || Constants.paid_status.includes(this.cart.sale_status)) return false
        break;
      case 'add_note':
      case 'retrieve_sale':
        return true;
        break;
      case 'add_sale_discount':
        if(this.cart.isRefund) return false;
        break;
      case 'exchange_minus':
        if(this.cart.isRefund || !this.selected_cart_product || Constants.paid_status.includes(this.cart.sale_status)
          || this.selected_cart_product.product.data.has_no_price) return false;
        break;
      case 'qty':
      case 'delete':
        if(!this.selected_cart_product || this.cart.isRefund || Constants.paid_status.includes(this.cart.sale_status)) return false;
        break;
      case 'add_discount':
        if(!this.selected_cart_product || this.cart.isRefund || Constants.paid_status.includes(this.cart.sale_status)
          || this.selected_cart_product.product.data.has_no_price) return false;
        break;
      case 'cash':
      case 'credit':
      case 'visa':
      case 'master':
      case 'amex':
      case 'discover':
      case 'diners':
      case 'jcb':
      case 'debit':
      case 'more':
        if(!this.cart.able_to_pay) return false;
        break;
      case 'layby':
      case 'on_account':
        if(this.cart.isRefund || !this.cart.customer || this.cart.total_to_pay!=this.cart.totalIncl
          || !this.cart.able_to_pay || Constants.paid_status.includes(this.cart.sale_status) || this.cart.sale_status == 'layby') return false;
        break;
      case 'store_credit':
        if(!this.cart.customer || (!this.cart.isRefund && this.cart.customer && this.cart.customer.data.credit<=0) || !this.cart.able_to_pay)
          return false;
        break;
      case 'void_sale':
        if(!this.allow_void_sales) return false;
        else return true;
        break;
      case 'return_items':
        if(['parked' ,'new'].includes(this.cart.sale_status) || this.cart.voided_payments.length>0) return false;
        break;
      case 'void_item':
        if(['parked' ,'new'].includes(this.cart.sale_status) || !this.selected_cart_product) return false;
        break;
      default:
        return false;
    }
    return true;
  }

  loadOpenclose() {
    this.loading_register = true;
    this.openClose.loadCurrent(() => {
      this.loading_register = false;
      this.loadCart();
    }, () => {
      this.loading_register = false;
    })
  }

  public get isOpenRegister():boolean {
    return this.openClose._id != '';
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

  loadCategories() {
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
        this.getCategories();
        this.searchProducts();
      }
    })
  }

  getFilter():any {
    let filter = {range: 'all-factor', outlet: null, type: this.selectedType._id, keyword: this.keyword.value, touch: true};
    if(this.cart.user.outlet) {
      filter.outlet = this.cart.user.outlet._id;
    } else {
      delete filter.outlet;
    }
    return filter;
  }

  applyFilteredProduct() {
    if(!this.keyword.value) return;
    this.product_page_info.page = 1;
    let filter = this.getFilter();
    let sort = {field: 'name', order: 1};
    delete filter.touch;
    this.productDatasource.searchProducts(filter, this.product_page_info.page, this.product_page_info.size, sort, data => {
      if(data.data.length == 0) {
        const dialogRef = this.dialog.open(ConfirmDlgComponent, {
          width: '500px',
          data: {
            title: 'Confirm New Product',
            msg: 'This product not in the database would you like to enter a new product?',
            ok_button: 'OK',
            cancel_button: 'Cancel'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result && result == 'process') {
            this.router.navigate(['/dashboard/product/product-add'], {queryParams: {action: 'add', keyword: this.keyword.value}});
          } else {
            this.searchProducts();
          }
        });
      } else if(data.data.length == 1) {
        this.addToCart(data.data[0]);
        this.keyword.setValue('');
      } else {
        this.searchProducts();
      }
    });
  }

  searchProducts() {
    this.productDatasource.loadProducts(this.getFilter(), this.product_page_info.page-1, this.product_page_info.size, 'name', 1, () => {
      this.getProducts();
      this.focusKeyword();
    });
  }

  applyFilter() {
    this.product_page_info.page = 1;
    this.searchProducts();
  }

  clearKeyword() {
    this.keyword.setValue('');
    this.searchProducts();
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

  loadAllCustomers(): void {
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
    this.loading_cart = true;
    this.activateRoute.queryParams.subscribe(query => {
      let id_sale = '';
      let action = '';
      if (query && query._id) id_sale = query._id;
      if (query && query.action) action = query.action;
      this.cart.loadCurrent(result => {
        if(id_sale) {
          this.cart.loadFromSale(id_sale, sale_data=>{
            if(sale_data.cart_mode == 'return' && this.cart.cart_mode == 'return' && sale_data.origin_sale_number == this.cart.origin_sale_number) {
              this.initCart();
              this.loading_cart = false;
            } else {
              this.confirmHold(() => {
                this._loadFromSale(sale_data, action);
                this.loading_cart = false;
              }, () => {
                this.initCart();
                this.loading_cart = false;
              })
            }
          }, () => {
            this.initCart();
            this.loading_cart = false;
          })
        } else {
          this.initCart();
          this.loading_cart = false;
        }
      }, () => {
        if(id_sale) {
          this.cart.loadFromSale(id_sale, sale_data => {
            this._loadFromSale(sale_data, action);
            this.loading_cart = false;
          }, () => {
            this.initCart();
            this.loading_cart = false;
          })
        } else {
          this.initCart();
          this.loading_cart = false;
        }
      })
    });
  }

  private _loadFromSale(sale_data:any, action:string) {
    sale_data.cart_mode = action;
    if(action == 'return') {
      if(sale_data.customer){
        sale_data.origin_customer = sale_data.customer._id;
      }
      sale_data.origin_status = sale_data.sale_status;
      sale_data.origin_sale_number = sale_data.sale_number;
      sale_data._id = '';
      sale_data.sale_number = this.util.genRandomOrderString(8);
    }
    this.cart.loadByCart(sale_data);

    if(sale_data.cart_mode == 'return') {
      if(action == 'return') this.cart.setRefund();
      if(!this.cart.customer) {
        this.addCustomerToSale(customer => {
          this.cart.customer = customer;
          this.initCart(action);
        }, () => {
          this.initCart(action);
        })
      } else {
        this.initCart(action);
      }
    } else {
      this.initCart(action);
    }
  }

  initCart(action?:string) {
    if(this.cart.customer) {
      let index = this.customers.findIndex(item => {
        return this.cart.customer && item._id == this.cart.customer._id;
      })
      if(index>-1) this.addedCustomer = this.customers[index];
    } else {
      this.addedCustomer = null;
    }
    this.processCustomerCredit();
    if(this.cart.sale_status == 'on_account') {
      this.processCustomerBalance('', this.cart.total_paid);
    }
    if(action == 'return') {
      this.utilService.get('sale/sale', {sale_number: this.cart.origin_sale_number}).subscribe(result => {
        if(result && result.body) {
          const cart = result.body[0];
          if(cart.returned) {
            this.toastService.showWarning('Already reaturned sale.');
            this.router.navigateByUrl('/dashboard/sell/selling');
          } else {
            if(!this.cart._id) {
              this.cart.save(()=>{
                this.router.navigateByUrl('/dashboard/sell/selling');
              });
            }
          }
        } else {
          this.toastService.showWarning('No existing original sale.');
          this.router.navigateByUrl('/dashboard/sell/selling');
        }
      })
    } else if(action == 'void') {
      if(this.cart.voided) {
        this.toastService.showWarning('Already voided sale.');
        this.router.navigateByUrl('/dashboard/sell/selling');
      } else {
        this.cart.save(()=>{
          this.router.navigateByUrl('/dashboard/sell/selling');
        });
      }
    }
  }

  selCustomer() {
    if(this.isOpenRegister) {
      if(this.addedCustomer) {
        this.cart.customer = this.addedCustomer;
      } else {
        this.cart.customer = null;
      }
      this.cart.save();
    }
  }

  addToCart(product:Product): void {
    this.keyword.setValue('');
    if (!this.isOpenRegister || this.cart.isRefund) {
      this.toastService.showWarning('On Return Items, you can\'t add new product to cart.');
      return;
    }
    if(!this.checkCustomerInfoReq(product)) return;
    if(!this.checkRequiredAge(product)) return;
    if(product.data.variant_inv) {
      let cart_products:CartProduct[] = [];
      for(let vp of product.data.variant_products) {
        let cart_product = new CartProduct(product, vp._id);
        if(!cart_product.price && product.data.price_prompt || !cart_product.weight && product.data.scale_product
          || !cart_product.serial && product.data.serial_required) {
          const properties = this.getPropertiesFromCarts(product._id, vp._id);
          cart_product.prompt_price = properties.prompt_price;
          cart_product.weight = properties.weight;
          cart_product.serial = properties.serial;
        }
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
            cart_product.prompt_price = sp.prompt_price;
            cart_product.weight = sp.weight;
            cart_product.serial = sp.serial;
            this.cart.addProduct(cart_product, sp.qty);
          }
          this.cart.save();
        }
        this.focusKeyword();
      });
    } else {
      let cart_product = new CartProduct(product);
      const properties = this.getPropertiesFromCarts(product._id);
      cart_product.prompt_price = properties.prompt_price;
      cart_product.weight = properties.weight;
      cart_product.serial = properties.serial;

      let data = {price: '', weight:'', blank_cup_weight: 0, serial: ''}, f = false;
      if(!cart_product.price && product.data.price_prompt) {
        f = true;
      } else {
        delete data.price;
      }
      if(!cart_product.weight && product.data.scale_product) {
        data.blank_cup_weight = product.data.blank_cup_weight;
        f = true;
      } else {
        delete data.blank_cup_weight;
        delete data.weight;
      }
      if(!cart_product.serial && product.data.serial_required) {
        f = true;
      } else {
        delete data.serial;
      }
      if(f){
        const dialogRef = this.dialog.open(PriceDlgComponent, {
          width: '500px',
          data: data
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result && result.action == 'process' && result.data) {
            if(result.data.prompt_price) cart_product.prompt_price = result.data.prompt_price;
            if(result.data.weight) cart_product.weight = result.data.weight;
            if(result.data.serial) cart_product.serial = result.data.serial;
            this.cart.addProduct(cart_product);
            this.cart.save();
          }
          this.focusKeyword();
        });
      } else {
        this.cart.addProduct(cart_product);
        this.cart.save();
        this.focusKeyword();
      }
    }
  }

  getPropertiesFromCarts(product_id:string, variant_id:string='') {
    let data = {
      prompt_price: 0,
      weight: 0,
      serial: ''
    };
    let index = this.cart.products.findIndex(item => item.product_id == product_id && item.variant_id == variant_id);
    if(index>-1) {
      data.prompt_price = this.cart.products[index].prompt_price;
      data.weight = this.cart.products[index].weight;
      data.serial = this.cart.products[index].serial;
    }
    return data;
  }

  changePromptPrice(cart_product: CartProduct) {
    let product = this.cart.getProductsFromBundle(cart_product);
    if(product) {
      const dialogRef = this.dialog.open(PriceDlgComponent, {
        width: '400px',
        data: {price: product.prompt_price}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'process' && result.data) {
          if(result.data.prompt_price) product.prompt_price = result.data.prompt_price;
          this.cart.save();
        }
        this.focusKeyword();
      });
    }
  }

  changeSerial(cart_product: CartProduct) {
    let product = this.cart.getProductsFromBundle(cart_product);
    if(product) {
      const dialogRef = this.dialog.open(PriceDlgComponent, {
        width: '400px',
        data: {serial: product.serial}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'process' && result.data) {
          if(result.data.serial) product.serial = result.data.serial;
          this.cart.save();
        }
        this.focusKeyword();
      });
    }
  }

  changeWeight(cart_product: CartProduct) {
    let product = this.cart.getProductsFromBundle(cart_product);
    if(product) {
      const dialogRef = this.dialog.open(PriceDlgComponent, {
        width: '400px',
        data: {weight: product.weight, blank_cup_weight: product.product.data.blank_cup_weight}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'process' && result.data) {
          if(result.data.weight) product.weight = result.data.weight;
          this.cart.save();
        }
        this.focusKeyword();
      });
    }
  }

  checkCustomerInfoReq(product: Product): boolean {
    if(!product.data.customer_info_req || this.cart.customer) {
      return true;
    } else {
      this.dialog.open(ConfirmDlgComponent, {
        width: '500px',
        data: {
          title: 'Confirm Customer Info',
          msg: 'Need customer info in order to buy this product.<br>Please choose a customer.',
          ok_button: 'OK'
        }
      });
      return false;
    }
  }

  checkRequiredAge(product: Product):boolean {
    if(!product.data.age_check_required) {
      return true;
    } else {
      let customer = this.cart.customer;
      if(!customer) {
        this.dialog.open(ConfirmDlgComponent, {
          width: '500px',
          data: {
            title: 'Confirm Customer Age',
            msg: 'Need to check customer if he(she) meets the required age to buy this product.<br>Please choose a customer.',
            ok_button: 'OK'
          }
        });
        return false;
      } else {
        let required_age = product.data.required_age;
        let customer_age = this.util.getAge(customer.data.birthday);
        if(customer_age<required_age) {
          this.dialog.open(ConfirmDlgComponent, {
            width: '500px',
            data: {
              title: 'Confirm Customer Age',
              msg: 'Only customer over the age of ' + required_age + ' can buy this product.',
              ok_button: 'OK'
            }
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }

  focusKeyword() {
    this.ctrlKeyword.nativeElement.focus();
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
      this.focusKeyword();
    });
  }

  addSaleDiscount(): void {
    if(!this.allow_discount) {
      this.toastService.showWarning(Constants.message.notAllowedDiscount);
      return;
    }
    if(!this.passed_password) {
      this.confirmPassword(() => {
        this._addDiscount(true);
      });
    } else {
      this._addDiscount(true);
    }
  }

  addDiscount(): void {
    if(!this.selected_cart_product) return;
    if(!this.allow_discount) {
      this.toastService.showWarning(Constants.message.notAllowedDiscount);
      return;
    }
    if(this.selected_cart_product.product.data.none_discount_item) {
      this.toastService.showWarning('This product is not discountable.');
      return;
    }
    if(!this.passed_password) {
      this.confirmPassword(() => {
        this._addDiscount(false);
      });
    } else {
      this._addDiscount(false);
    }
  }

  changeDiscountItem(product:CartProduct) {
    product.checked = true;
    this.deSelectOther(product);
    this.addDiscount();
  }

  _addDiscount(is_global:boolean) {
    let data = {discount: this.cart.discount, is_global: is_global};
    if(!is_global) data.discount = this.selected_cart_product.discount;
    const dialogRef = this.dialog.open(DiscountDlgComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'process') {
        if(is_global) this.cart.setGlobalDiscount();
        this.cart.save();
      }
      this.focusKeyword();
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
      } else {
        this.focusKeyword();
      }
    });
  }

  startPay(pay_mode:string): void {
    if(pay_mode == 'more') {
      const dialogRef = this.dialog.open(MorePaymentDlgComponent, {
        width: '500px',
        data: {payment_buttons: this.more_buttons}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.pay_mode) {
          this.pay(result.pay_mode, this.cart.total_to_pay);
        } else {
          this.focusKeyword();
        }
      });
      return;
    }
    if(pay_mode == 'cash' && !this.cart.isRefund && !this.cart.isVoid) {
      const dialogRef = this.dialog.open(AmountDlgComponent, {
        width: '500px',
        data: {total_amount_to_pay: this.cart.total_to_pay}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'enter') {
          if(this.cart.isRefund && result.amount < 0 || !this.cart.isRefund && result.amount > 0) {
            this.pay(pay_mode, result.amount);
          }
        } else {
          this.focusKeyword();
        }
      });
    } else {
      this.pay(pay_mode, this.cart.total_to_pay);
    }
  }

  pay(pay_mode: string, pay_amount: number): void {
    if(this.cart.isRefund) {
      this.refund(pay_mode, pay_amount);
      return;
    }
    if(this.cart.isVoid) {
      this.voidItems(pay_mode);
      return;
    }
    if (pay_amount <= 0) {
      return;
    }
    this.checkProductsInventory(() => {
      if(this.cart.products.length == 0) {
        this.toastService.showWarning(Constants.message.invalidCartProducts);
      } else {
        if(!['cash', 'store_credit'].includes(pay_mode)) {
          if(this.cart.store_info.preferences.confirm_pay) {
            this.confirmPay(pay_mode, () => {
              this._pay(pay_mode, pay_amount);
            })
          } else {
            this._pay(pay_mode, pay_amount);
          }
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

  refund(pay_mode: string, pay_amount: number): void {
    if (pay_amount >= 0) {
      return;
    }
    this._pay(pay_mode, pay_amount);
  }

  voidItems(pay_mode:string) {
    let pay_amount = this.cart.voided_amount;
    if(pay_amount > 0) {
      this._pay(pay_mode, pay_amount);
    }
  }

  private _pay(pay_mode: string, pay_amount:number) {
    this.cart.pay(pay_mode, pay_amount);
    this.processCustomerBalance(pay_mode, pay_amount);
    if(this.cart.able_to_complete) {
      if(!['layby'].includes(pay_mode)) {
        if(!this.cart.isVoid) {
          for(let product of this.cart.products) {
            product.updateInventory();
          }
        } else {
          for(let p of this.cart.products) {
            if(p.void) {
              let pp = new CartProduct(p.product, p.variant_id);
              pp.loadDetails(p);
              pp.qty *= -1;
              pp.updateInventory();
            }
          }
        }
      }
      this.completeSale()
    } else {
      this.cart.save();
    }
  }

  processCustomerBalance(pay_mode:string, pay_amount:number) {
    if (this.addedCustomer) {
      if (pay_mode === 'on_account') {
        this.addedCustomer.temp.debit = pay_amount;
        this.addedCustomer.temp.total_spent = pay_amount;
      } else if(pay_mode == 'store_credit') {
        if(this.cart.isRefund || this.cart.isVoid) {
          this.addedCustomer.temp.credit = Math.abs(pay_amount);
          this.addedCustomer.temp.total_issued = Math.abs(pay_amount);
        } else {
          this.addedCustomer.temp.credit = -pay_amount;
          this.addedCustomer.temp.total_redeemed = Math.abs(pay_amount);
        }
      } else if(this.cart.sale_status == 'on_account') {
        if(this.cart.isRefund || this.cart.isVoid) {
          this.addedCustomer.temp.debit = Math.abs(pay_amount);
          this.addedCustomer.temp.total_spent = Math.abs(pay_amount);
        } else {
          this.addedCustomer.temp.debit = -pay_amount;
          this.addedCustomer.temp.total_spent = -pay_amount;
        }
      } else {
        if(this.store.customer_point_gift_settings.point_used) {
          let group = this.addedCustomer.data.groupId;
          if(typeof group.point_rates != 'undefined') {
            let index = group.point_rates.findIndex(item => item.payment == pay_mode);
            if(index>-1) {
              let rate = group.point_rates[index].rate;
              let point = parseFloat((pay_amount * rate / 100).toFixed(2));
              this.addedCustomer.temp.point = point;
              this.addedCustomer.temp.point_issued = point;
            }
          }
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

  newSale() {
    if(this.cart.sale_status == 'new') {
      this.confirmHold(() => {
        this.newCart();
      })
    } else {
      this.newCart();
    }
  }

  newCart() {
    this.addedCustomer = null;
    setTimeout(() => {
      this.applyFilter();
    })
    this.cart.delete(() => {
      this.cart.init();
      this.loadLastSale();
    })
  }

  parkSale() {
    const dialogRef = this.dialog.open(NoteDlgComponent, {
      width: '500px',
      data: {item: 'Park', cart : this.cart, msg: Constants.message.sale_note.park}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {
        this.cart.sale_status = 'parked';
        this.cart.save(() => {
          this.toastService.showSuccess(Constants.message.sale.parked);
          this.cart.delete(() => {
            this.newCart();
          })
        });
      } else {
        this.focusKeyword();
      }
    });
  }

  quoteSale() {
    const dialogRef = this.dialog.open(NoteDlgComponent, {
      width: '500px',
      data: {item: 'Quote', cart : this.cart, msg: Constants.message.sale_note.quote}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {
        this.cart.sale_status = 'quoted';
        this.cart.save(() => {
          this.toastService.showSuccess(Constants.message.sale.quote);
          this.cart.delete(() => {
            this.newCart();
          })
        });
      } else {
        this.focusKeyword();
      }
    });
  }

  markUnfulfilled() {
    const dialogRef = this.dialog.open(UnfulfilledDlgComponent, {
      width: '620px',
      data: {user: this.user, customers: this.customers, cart: this.cart}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {
        let mode = this.cart.fulfillment.mode, status = mode + '_unfulfilled';
        this.cart.sale_status = status;
        this.cart.save(() => {
          this.toastService.showSuccess(Constants.message.sale[status]);
          this.cart.delete(() => {
            this.newCart();
          })
        });
      } else {
        this.focusKeyword();
      }
    });
  }

  completeSale(): void {
    const payment_status = this.cart.payment_status;
    const sale_status = this.cart.sale_status;
    const aa = ['layby', 'on_account'];
    if(!this.cart.isVoid) {
      if(aa.includes(payment_status) && sale_status == 'new'){
        this.cart.sale_status = payment_status;
      } else if(aa.includes(sale_status)) {
        this.cart.sale_status = sale_status + '_completed';
      } else {
        this.cart.sale_status = 'completed';
      }
    } else {
      if(this.cart.isVoidedSale) this.cart.voided = true;
    }
    if(this.cart.cart_mode == 'return') {
      this.cart.sale_status = 'return_completed';
    }

    if(this.addedCustomer) this.addedCustomer.save();
    // if (this.addedCustomer && this.send_email) {
    //   this.emailToCustomer(this.addedCustomer.data.email);
    // } else {
      this.cart.save(() => {
        this._completeSale();
      });
    // }
  }

  emailToCustomer(email): void{
    const data = {};
    Object.assign(data, {email, cart_id: this.cart._id});
    this.utilService.post('sell/email', data).subscribe(result => {
      this.cart.save(() => {
        this._completeSale();
      });
    });
  }

  _completeSale() {
    this.toastService.showSuccess(Constants.message.successComplete);
    this.btnPrintTran.nativeElement.click();
    if(this.cart.payment_status == 'cash') {
      this.showChange();
    } else {
      this.newCart();
    }
  }

  discardSale() {

    if(this.cart.products.length == 0 && !this.cart._id) {
      return;
    }
    if(this.cart.store_info.preferences.confirm_discard_sale) {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '400px',
        data: {action: 'delete', item: 'sale'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'delete') {
          this.cart.deleteSale(() => {
            this.toastService.showSuccessRemove();
            this.newCart();
          })
        } else {
          this.focusKeyword();
        }
      });
    } else {
      this.cart.deleteSale(() => {
        this.newCart();
      })
    }
  }

  loadParkedSales(){
    const data={user_id: this.user._id, private_web_address: this.user.private_web_address, sale_status:'parked'};
    this.loading_parked_sales = true;
    this.parked_sales = [];
    this.utilService.get('sale/sale', data).subscribe(result => {
      this.parked_sales = result.body;
      setTimeout(() => {
        let h = this.parkedSales.popoverDiv.nativeElement.clientHeight + 2;
        this.parkedSales.top = this.btnRetrieveSale.nativeElement.offsetTop - h ;
        this.loading_parked_sales = false;
      }, 200)
    })
  }

  getParkedSalelabel(sale:any) {
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
      this.confirmHold(() => {
        const _sale = {...sale};
        this._retrieveSale(_sale);
      })
    }
  }

  private _retrieveSale(sale: any): void {
    this.newCart();
    this.loading_cart = true;
    this.cart.loadFromSale(sale._id, data => {
      this.cart.loadByCart(data);
      this.initCart();
      this.loading_cart = false;
      this.cart.save();
    })
  }

  confirmHold(processCallback?:Function, closeCallback?:Function) {
    const dialogRef = this.dialog.open(HoldDlgComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {
        if(this.cart.sale_status == 'new') this.cart.sale_status = 'parked';
        this.cart.save(processCallback)
      } else {
        if(closeCallback) closeCallback();
      }
    });
  }

  confirmPay(pay_mode:string, processCallback?:Function, closeCallback?:Function) {
    let p = 'by "' + Payment.getPaymentLabel(pay_mode) + '"';
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Confirm Sale ' + p,
        msg: 'Are you sure to process this sale ' + p + '?',
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
      maxHeight: '500px',
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

  showChange() {
    const dialogRef = this.dialog.open(ChangeDlgComponent, {
      width: '400px',
      data: {
        change: this.util.getPriceWithCurrency(this.cart.change)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.newCart();
    });
  }

  voidSale() {
    if(!this.allow_void_sales) {
      this.toastService.showWarning(Constants.message.notAllowedVoidSale);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'You are about to void this sale.',
        msg: 'This will return the products back into your inventory and remove any payments that were recorded. You’ll still be able to see the details of this sale once it has been voided. This can’t be undone.',
        ok_button: 'Void Sale',
        cancel_button: 'Don\'t Void'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {
        this.cart.voidSale(() => {
          this.toastService.showSuccess(Constants.message.successVoided);
          this.newCart();
        })
      } else {
        this.focusKeyword();
      }
    });
  }

  returnItems() {
    this.router.navigate(['/dashboard/sell/selling'], {queryParams: {_id: this.cart._id, action: 'return'}});
  }

  get floatInput(): any {return this.registerForm.get('open_value'); }
  get floatInputError(): string | void {
    if (this.floatInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.floatInput.hasError('min')) { return Constants.message.invalidMinValue.replace('?', Constants.open_value.min.toString()); }
  }

  public get isCustomerScreen():boolean {
    return this.cart && this.cart._id && this.cart.store_info.preferences.messagebox;
  }

  get keyword(): any {return this.searchForm.get('keyword'); }

  get is_fullscreen():boolean {
    return window.innerHeight == screen.height;
  }

  goFullScreen(){
    if(this.elemScreen.nativeElement.requestFullscreen){
        this.elemScreen.nativeElement.requestFullscreen();
    }
  }

  exitFullScreen(){
    if(document.exitFullscreen){
        document.exitFullscreen();
    }
  }

  getPaymentButtons() {
    let i=0;
    for(let p of this.payment.payment_buttons) {
      if(i<6) {
        this.payment_buttons.push(p);
      } else {
        this.more_buttons.push(p);
      }
      i++;
    }
    i = this.payment_buttons.length;
    for(let j=i;j<7;j++) {
      let button:IPaymentButton = {code: '', label: ''};
      if(j==i) {
        if(this.payment.payment_buttons.length>6) {
          button.code = 'more';
          button.label = 'More Payments';
        }
      }
      this.payment_buttons.push(button);
    }
  }

  isRefundButton(code:string) {
    return (!['layby', 'store_credit', 'on_account'].includes(code)) && (this.cart.isRefund || this.cart.cart_mode=='void');
  }
}
