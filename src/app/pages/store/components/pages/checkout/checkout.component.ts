import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Onlineorder } from '@app/_classes/onlineorder.class';
import { Store } from '@app/_classes/store.class';
import { UtilService } from '@app/_services/util.service';
import { AuthService } from '@app/_services/auth.service';
import { CartProduct } from '@app/_classes/cart_product.class';
import { Constants } from '@app/_configs/constant';
declare var paypal;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  @ViewChild('paypal') paypalElement: ElementRef;
  store_info: Store;
  order: Onlineorder;
  util = UtilFunc;
  default_tax = 'outlet';
  default_tax_rate = 0;
  form:FormGroup;
  countries = [];
  paymentWay: any = [];
  payment_method = '';
  diff_address: boolean = false;
  loading: boolean = true;
  shipping = {
    street: '',
    suburb: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  }

  error_msg = Constants.message.requiredField;
  paymentHandler:any = null;
  stripe; // : stripe.Stripe;
  card;
  cardErrors;
  @ViewChild('cardElement') cardElement: ElementRef;

  constructor(
    private cartService: CartService, 
    private utilService: UtilService,
    private authService: AuthService,    
    private fb: FormBuilder,
    private router: Router,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      company: [''],
      street: ['', [Validators.required]],
      suburb: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postcode: ['', [Validators.required]],
      country:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
    });

    this.store_info = new Store(this.authService, this.utilService);    
    this.utilService.get('sell/outlet', {is_main: true}).subscribe(result => {
      if(result && result.body) {
        let outlet = result.body[0];
        this.default_tax_rate = outlet.defaultTax.rate;
      }
    })
    this.countries = this.utilService.countries;
  }

  ngOnInit() {
    this.order = new Onlineorder(this.authService, this.utilService);        
    this.loadStoreInfo();
  }

  ngAfterViewInit() {
    
  }

  loadStoreInfo() {
    this.store_info.load(() => {      
      this.default_tax = this.store_info.default_tax;
      if(this.store_info.store_pickup){
        this.paymentWay.push({
          id: 'store_pickup', label: 'Store Pickup'
        })
      }
      if(this.store_info.paypal.active && this.store_info.paypal.client_id && this.store_info.paypal.secret) {
        this.paymentWay.push({
          id: 'paypal', label: 'Paypal'
        })
        this.loadPaypalScript(this.store_info.paypal.client_id);        
      }
      if(this.store_info.stripe.active && this.store_info.stripe.public_key && this.store_info.stripe.secret_key) {
        this.paymentWay.push({
          id: 'stripe', label: 'Stripe'
        })
        this.loadStripeScript(this.store_info.stripe.public_key);
      }
      if(this.paymentWay.length>0) this.payment_method = this.paymentWay[0].id;
    });
  }

  loadPaypalScript(client_id) {
    if(!window.document.getElementById('paypal-script')) {
      let script = this._renderer2.createElement('script');
      script.id = "paypal-script";
      script.src = 'https://www.paypal.com/sdk/js?client-id=' + client_id + '&vault=true';
      script.type = 'text/javascript';
      if (script.readyState) {  //IE
        script.onreadystatechange = () => {        
          if (script.readyState === "loaded" || script.readyState === "complete") {
            this.loadPaypal();
          }
        };
      } else {  //Others
        script.onload = () => {
          this.loadPaypal();
        };
      }
      this._renderer2.appendChild(this._document.body, script);
    } else {
      this.loadPaypal();
    }
  }

  loadPaypal() {
    const self = this;
    if(paypal) {
      setTimeout(() => {        
        paypal.Buttons({  
          style: {
            layout:  'vertical',
            color:   'blue',
            shape:   'rect',
            label:   'checkout',
            size: 'responsive'
          },
          onInit: function(data, actions) {            
            self.loading = false;
          },
          createOrder: function(data, actions) {  
            return actions.order.create(self.paypal_order);
          },
          onApprove: function (data, actions) {  
            console.log(data);  
            // return actions.order.capture().then(function(details) {
            //   // This function shows a transaction success message to your buyer.
            //   alert('Transaction completed by ' + details.payer.name.given_name);
            // });
            self.submit();
          },  
          onCancel: function (data) {  
            // Show a cancel page, or return to cart  
            console.log(data);  
          },  
          onError: function (err) {  
            // Show an error page here, when an error occurs  
            console.log(err);  
          }  
      
        }).render(this.paypalElement.nativeElement); 
      }, 100);
    }
  }

  loadStripeScript(publishable_key:string) {
    if(!window.document.getElementById('stripe-script')) {
      let script = this._renderer2.createElement('script');
      script.id = "stripe-script";
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.type = 'text/javascript';
      if (script.readyState) {  //IE
        script.onreadystatechange = () => {        
          if (script.readyState === "loaded" || script.readyState === "complete") {
            this.createStripeHandler(publishable_key);
          }
        };
      } else {  //Others
        script.onload = () => {
          this.createStripeHandler(publishable_key);
        };
      }
      this._renderer2.appendChild(this._document.body, script);
    } else {
      this.createStripeHandler(publishable_key);
    } 
  }

  payStripe() {    
    this.paymentHandler.open({
      name: this.store_info.store_name,
      description: 'Checkout',
      email: this.emailInput.value,
      amount: parseFloat(this.total_value) * 100
    });
  
  }

  createStripeHandler(publishable_key:string) {        
    let self = this;
    this.paymentHandler = (<any>window).StripeCheckout.configure({
      key: publishable_key,
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        self.submit();
      }
    });
    window.addEventListener('popstate', () => {
      this.paymentHandler.close();
    });
  }

  public get paypal_order():any {
    const order = {
      intent: 'CAPTURE', 
      payer: {
        name: {
          given_name: this.firstNameInput.value,
          surname: this.lastNameInput.value
        },
        address: this.billing_address,
        email_address: this.emailInput.value,
        phone: {
          phone_type: "MOBILE",
          phone_number: {
            national_number: this.mobileInput.value
          }
        }
      },
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: this.total_value
        },
        shipping: {
          address: this.shipping_address
        }
      }]
    }
    return order;
  }

  public get billing_address():any {
    let address = {
      address_line_1: this.streetInput.value,
      address_line_2: '',
      admin_area_2: this.cityInput.value,
      admin_area_1: this.stateInput.value,
      postal_code: this.postCodeInput.value,
      country_code: this.getCountryCode(this.countryInput.value)
    }
    return address;
  }

  public get shipping_address():any {
    if(!this.diff_address) {
      return this.billing_address;
    } else {
      let address = {
        address_line_1: this.shipping.street,
        address_line_2: '',
        admin_area_2: this.shipping.city,
        admin_area_1: this.shipping.state,
        postal_code: this.shipping.postcode,
        country_code: this.getCountryCode(this.shipping.country)
      }
      return address;
    }
  }

  getCountryCode(_id) {
    let index = this.countries.findIndex(item => item._id == _id);
    if(index > -1) {
      return this.countries[index].country_code;
    }
    return 'US';
  }

  public get cartProducts():CartProduct[] {
    const private_web_address = this.utilService.private_web_address;
    return this.cartService.cartProducts.filter(item => item.product.data.private_web_address == private_web_address);
  }

  public getTaxAmount(item:CartProduct):string {
    if(this.default_tax == 'product') {
      return item.taxAmount;
    } else {
      let sum = item.totalPrice * this.default_tax_rate / 100;
      if(sum>0) {
        return this.util.getPriceWithCurrency(sum);
      } else {
        return 'Free';
      }
    }
  }

  submit() {
    if(this.form.valid) {
      if(!this.diff_address) {
        Object.keys(this.shipping).forEach(key => {
          this.shipping[key] = this.form.value[key];
        })        
      } else {
        if(!this.shipping.state || !this.shipping.country || !this.shipping.postcode) {
          return;
        }
      }
      for(let p of this.cartProducts) {
        this.order.addProduct(p, p.qty);
      }
      const data = this.form.value;
      this.order.customer.name = data.first_name + ' ' + data.last_name;
      this.order.customer.email = data.email;
      this.order.customer.mobile = data.mobile;
      this.order.customer.company = data.company;
      Object.keys(this.order.customer.billing_address).forEach(key => {
        this.order.customer.billing_address[key] = data[key];
      })
      Object.keys(this.order.customer.shipping_address).forEach(key => {
        this.order.customer.shipping_address[key] = this.shipping[key];
      })      
      this.order.pay(this.payment_method, this.order.totalIncl);      
      this.order.save(result => {     
        this.clearCart();   
        this.router.navigate(this.util.getRouterLink('/order-success/' + this.order._id));
      })
    }
  }

  public clearCart() {
    const private_web_address = this.utilService.private_web_address;   
    this.cartService.clearCart(private_web_address);
  }

  public get isValidSubmit() {    
    return this.form.valid && this.cartProducts.length > 0 && this.payment_method 
          && (!this.diff_address || (this.diff_address && this.shipping.street && this.shipping.city && this.shipping.state 
            && this.shipping.country && this.shipping.postcode));
  }

  public get total():string {
    let sum = this.total_value;
    return this.util.getPriceWithCurrency(sum);    
  }

  public get total_value():string {
    let sum = 0;
    if(this.default_tax == 'product') {
      sum = this.cartProducts.reduce((a, b)=> a + b.totalInclTax, 0);
    } else {
      let subtotal = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);  
      sum = subtotal * (1 + this.default_tax_rate/100);
    }
    return sum.toFixed(2);
  }

  public get subTotal():string {
    let sum = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);
    return this.util.getPriceWithCurrency(sum);    
  }

  public get totalTax():string {    
    let sum = 0;
    if(this.default_tax == 'product') {
      sum = this.cartProducts.reduce((a, b)=> a + b.totalTaxAmount, 0);
    } else {
       if(this.default_tax_rate>0) {
        let subtotal = this.cartProducts.reduce((a, b)=> a + b.qty * b.price, 0);
        sum = subtotal * (this.default_tax_rate/100);
       } else {
         return 'Free';
       }
    }    
    return this.util.getPriceWithCurrency(sum);    
  }

  public get taxRate_str():string {
    if(this.default_tax == 'outlet') {      
      return '(+' + this.default_tax_rate.toFixed(2) + '%)';
    }
    return '';
  }

  public get firstNameInput() {return this.form.get('first_name')}
  public get firstNameInputError():string {
    if(this.firstNameInput.hasError('required')) return this.error_msg;
  }

  public get lastNameInput() {return this.form.get('last_name')}
  public get lastNameInputError():string {
    if(this.lastNameInput.hasError('required')) return this.error_msg;
  }

  public get streetInput() {return this.form.get('street')}
  public get streetInputError():string {    
    if(this.streetInput.hasError('required')) return this.error_msg;
  }

  public get cityInput() {return this.form.get('city')}
  public get cityInputError():string {    
    if(this.cityInput.hasError('required')) return this.error_msg;
  }

  public get stateInput() {return this.form.get('state')}
  public get stateInputError():string {
    if(this.stateInput.hasError('required')) return this.error_msg;
  }

  public get postCodeInput() {return this.form.get('postcode')}
  public get postCodeInputError():string {
    if(this.postCodeInput.hasError('required')) return this.error_msg;
  }

  public get countryInput() {return this.form.get('country')}
  public get countryInputError():string {
    if(this.countryInput.hasError('required')) return this.error_msg;
  }

  public get emailInput() {return this.form.get('email')}
  public get emailInputError():string {
    if(this.emailInput.hasError('required')) return this.error_msg;
    if(this.emailInput.hasError('email')) return Constants.message.validEmail;
  }

  public get mobileInput() {return this.form.get('mobile')}
  public get mobileInputError():string {
    if(this.mobileInput.hasError('required')) return Constants.message.requiredField;    
  }

}
