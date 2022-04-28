import { Component, OnInit } from '@angular/core';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cart } from '@app/_classes/cart.class';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import {ChartData, ChartDataSets, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import * as UtilFunc from '@app/_helpers/util.helper';
import { Product } from '@app/_classes/product.class';
import { Onlineorder } from '@app/_classes/onlineorder.class';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user:any;
  totalByMonth: string = '';
  totalByDay: string = '';
  stockLevels: number         = 0;
  stockOnHand: number         = 0;
  productsByUser:string = '';
  productsByCustomer: string  = '';
  productsByOutlet: string    = '';
  registerClosures: number    = 0;
  
  salesChartData: ChartDataSets[] = [
    { data: [], label: 'Total Sales' }
  ];

  _salesChartData: ChartDataSets[] = [
    { data: [], label: 'Total Sales' }
  ];

  _ordersChartData: ChartDataSets[] = [
    { data: [], label: 'Total Orders' },
  ];

  productChartData: ChartDataSets[] = [];
  _productSalesChartData: ChartDataSets[] = [];
  _productOrdersChartData: ChartDataSets[] = [];
  isLoading:boolean = false;
  filteredProducts:Product[] = [];
  selectedProducts:Product[] = [];
  form: FormGroup;

  lineChartLabels: Label[] = [];

  public lineChartOptions:ChartOptions = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          id: 'x-axis-0',
          gridLines:{
            color: 'rgba(200,200,200,0.3)'
          },
        }
      ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(200,200,200,0.3)',
          },
          ticks: {
            stepSize : 20,      // interval value of gridlines of y-axis
          }

        }
      ]
    },
  };
  salesChartColors: Color[] = [
    {
      borderColor: '#00c5ff',
      backgroundColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: '#00c5ff',
    },
  ];
  _salesChartColors: Color[] = [
    {
      borderColor: '#00c5ff',
      backgroundColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: '#00c5ff',
    },
  ];
  _ordersChartColors: Color[] = [
    {
      borderColor: '#2ca121',
      backgroundColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: '#2ca121',
    },
  ];

  public productChartColors: Color[] = [];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  sales_mode:string = 'sales';
  product_mode:string = 'sales';
  period:string = 'daily';
  date_from = '';
  date_to = '';
  util = UtilFunc;
  cur_date = {year: 0, month: 0, date:0};
  sales_data:Onlineorder[] = [];  

  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.authService.currentUser.subscribe(user => {        
      this.user = user;           
    }); 

    this.form = this.fb.group({
      selectedProduct:['']
    })

    let date = new Date();
    this.cur_date = {
      year: date.getFullYear(), month: date.getMonth()+1, date: date.getDate()
    };

    this.date_from = [this.cur_date.year,('0' + this.cur_date.month).substr(-2), '01'].join('-');
    this.date_to = [this.cur_date.year, ('0' + this.cur_date.month).substr(-2), ('0' + this.cur_date.date).substr(-2)].join('-');    

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
            let index = this.selectedProducts.findIndex(item=>item._id == p._id);
            if(index == -1) {
              let product = new Product(this.authService, this.utilService);
              product.loadDetails(p);              
              this.filteredProducts.push(product);
            }
          }
        }
    });
  }

  displayFn(product: Product) {
    if (product) { 
      return product.data.name; 
    }
  }

  ngOnInit(): void {
    const start = [this.cur_date.year,('0' + this.cur_date.month).substr(-2), '01'].join('-');
    const end = [this.cur_date.year,('0' + this.cur_date.month).substr(-2), ('0' + this.cur_date.date).substr(-2)].join('-');
    let filter = {date_from: start, date_to: end};
    this.utilService.get('sale/order', filter).subscribe(result => {      
      if(result && result.body) {
        let sales_data:Cart[] = [];
        for(let s of result.body) {
          let sale = new Cart(this.authService, this.utilService);
          sale.loadByCart(s);
          sales_data.push(sale);
        }
        let sum = sales_data.reduce((a, b) => a + parseFloat(b.totalExcl), 0);
        this.totalByMonth = this.util.getPriceWithCurrency(sum);
        let sales = sales_data.filter(item => this.getFormattedDate(item.created_at) == this.getFormattedDate(new Date()));
        sum = sales.reduce((a, b) => a + parseFloat(b.totalExcl), 0);
        this.totalByDay = this.util.getPriceWithCurrency(sum);
      }      
    })

    this.utilService.get('product/product', {range: 'stock_level'}).subscribe(result => {
      if(result && result.body) {
        this.stockLevels = result.body.stock_level;
        this.stockOnHand = result.body.stock;
      }
    })
    let filter1 = this.user.outlet ? {outlet: this.user.outlet._id} : {};
    this.utilService.get('sale/order', filter1).subscribe(result => {
      if(result && result.body) {
        let sales_data:Cart[] = [];
        for(let s of result.body) {
          let sale = new Cart(this.authService, this.utilService);
          sale.loadByCart(s);
          sales_data.push(sale);
        }
        let sum = sales_data.reduce((a, b) => a + parseFloat(b.totalExcl), 0);
        this.productsByUser = this.util.getPriceWithCurrency(sum);        
        this.productsByOutlet = this.util.getPriceWithCurrency(sum);        
      }      
    })

    this.utilService.get('sale/order', {customer:'to_customer' }).subscribe(result => {
      if(result && result.body) {
        let sales_data:Cart[] = [];
        for(let s of result.body) {
          let sale = new Cart(this.authService, this.utilService);
          sale.loadByCart(s);
          sales_data.push(sale);
        }
        let sum = sales_data.reduce((a, b) => a + parseFloat(b.totalExcl), 0);
        this.productsByCustomer = this.util.getPriceWithCurrency(sum);        
      }      
    })
    this.loadData();
  }

  loadData() {    
    const filter = {date_from: this.date_from, date_to: this.date_to};
    this.sales_data = [];
    this.utilService.get('sale/order', filter).subscribe(result => {
      if(result && result.body) {
        for(let s of result.body) {
          let sale = new Onlineorder(this.authService, this.utilService);
          sale.loadDetails(s);
          this.sales_data.push(sale);
        }
      }
      this.loadDataSets();
    })
  }

  loadDataSets() {
    let start = new Date(this.date_from), end = new Date();
    if(this.date_to) {
      end = new Date(this.date_to);
    }    
    const all_dates = this.getAllRangeDates(start, end);
    this.lineChartLabels = [];    
    this.salesChartData[0].data = [];
    this._salesChartData[0].data = [];
    this._ordersChartData[0].data = [];
    this.productChartData = [];
    this.productChartColors = [];
    this._productSalesChartData = [];
    this._productOrdersChartData = [];
    for(let d of all_dates) {
      let label = this.getFormattedDate(d, this.period);
      let index = this.lineChartLabels.findIndex(item => item == label);
      if(index == -1) {
        this.lineChartLabels.push(label);        
      }
    }    
    for(let d of this.lineChartLabels) {
        let sales = this.sales_data.filter(item => this.getFormattedDate(item.created_at, this.period) == d);
        let sum = sales.reduce((a, b) => a + parseFloat(b.totalExcl), 0);                
        this._salesChartData[0].data.push(sum);
        this._ordersChartData[0].data.push(sales.length);        
    }
    for(let p of this.selectedProducts) {
      this.loadProductData(p);
    }
    this.setSalesChartData();
    this.setProductsChartData();
  }

  setSalesChartData() {
    if(this.sales_mode == 'sales') {
      this.salesChartData = [...this._salesChartData];
      this.salesChartColors = [...this._salesChartColors];
    } else {
      this.salesChartData = [...this._ordersChartData];
      this.salesChartColors = [...this._ordersChartColors];
    }
  }

  setProductsChartData() {
    if(this.product_mode == 'sales') {
      this.productChartData = [...this._productSalesChartData];      
    } else {
      this.productChartData = [...this._productOrdersChartData];      
    }
  }

  changePeriod() {
    this.loadDataSets();
  }

  changeSalesMode(mode: string) {
    this.sales_mode = mode;     
    this.setSalesChartData();
  }

  changeProductMode(mode: string) {
    this.product_mode = mode;     
    this.setProductsChartData();
  }

  changeDateRange() {
    this.loadData()
  }
  
  getSalesChartData() {

  }

  getAllRangeDates(startDate, endDate) {
    const interval = 1000 * 60 * 60 * 24; // 1 day
    const duration = endDate - startDate;
    const steps = duration / interval;
    return Array.from({length: steps+1}, (v,i) => new Date(startDate.valueOf() + (interval * i)));
  }

  getFormattedDate(current_date, period:string='daily'):Label {
    let d = new Date(current_date);    
    let year = d.getFullYear(), month = ('0' + (d.getMonth() + 1)).substr(-2), date = ('0' + d.getDate()).substr(-2);
    if(period == 'daily') {
      return [year, month, date].join('-');
    } else if(period == 'monthly') {
      return [year, month].join('-');
    } else {
      return year.toString();
    }
  }

  addProduct(product:Product) {
    if (!product) {
      return;
    }    
    this.selectedProducts.push(product);    
    this.loadProductData(product);
    this.form.get('selectedProduct').setValue(''); 
    this.setProductsChartData();
  }

  loadProductData(product:Product) {
    let randomColor = '';
    while (!randomColor) {
      randomColor = Math.floor(Math.random()*16777215).toString(16);
    }
    this.productChartColors.push(
      {
        borderColor: '#' + randomColor,
        backgroundColor: 'rgba(255,255,255,0)',
        pointBackgroundColor: '#' + randomColor,
      }
    )
    let chartData1:ChartDataSets = {data:[], label: product.data.name + ' - Sales'};
    let chartData2:ChartDataSets = {data:[], label: product.data.name + ' - Solds'};
    for(let d of this.lineChartLabels) {
      let sales = this.sales_data.filter(item => this.getFormattedDate(item.created_at, this.period) == d);
      let sum = 0; let solds = 0;
      for(let s of sales) {
        let products = s.products.filter(item => item.product_id == product._id);
        sum += products.reduce((a, b)=> a + b.discountedTotal, 0);
        solds += products.reduce((a, b)=> a + b.qty, 0);
      }      
      chartData1.data.push(sum);
      chartData2.data.push(solds);      
    }
    this._productSalesChartData.push(chartData1);
    this._productOrdersChartData.push(chartData2);    
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
    this._productSalesChartData.splice(index, 1);
    this._productOrdersChartData.splice(index, 1);
    this.productChartColors.splice(index, 1);
    this.setProductsChartData();
  }

  getColor(index:number) {
    return 'background-color:' + this.productChartColors[index].borderColor + '; color:white;';
  }

  public get total_sales():string {
    let sum = 0;
    for(let s of this._salesChartData[0].data) {
      if(typeof s == 'number') {
        sum += s;
      }
    }    
    return this.util.getPriceWithCurrency(sum);
  }
  public get total_orders():number {
    let sum = 0;
    for(let s of this._ordersChartData[0].data) {
      if(typeof s == 'number') {
        sum += s;
      }
    }
    return sum;
  }
  public get total_product_sales():string{
    let sum = 0;
    for(let d of this._productSalesChartData) {
      for(let s of d.data) {
        if(typeof s == 'number') {
          sum += s;
        }
      }
    }
    return this.util.getPriceWithCurrency(sum);
  }
  public get total_product_orders():number {
    let sum = 0;
    for(let d of this._productOrdersChartData) {
      for(let s of d.data) {
        if(typeof s == 'number') {
          sum += s;
        }
      }
    }
    return sum;
  }
}
