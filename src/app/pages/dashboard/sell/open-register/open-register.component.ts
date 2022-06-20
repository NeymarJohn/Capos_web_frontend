import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/_configs/constant';
import { UtilService } from 'src/app/_services/util.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AuthService } from '@service/auth.service';
import { Openclose } from '@app/_classes/openclose.class';
import { StorePolicy } from '@app/_classes/store_policy.class';
import { Producttype } from '@app/_classes/producttype.class';
import { ConfirmDlgComponent } from '@layout/confirm-dlg/confirm-dlg.component';
import { MatDialog } from '@angular/material/dialog';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register.component.html',
  styleUrls: ['./open-register.component.scss']
})

export class OpenRegisterComponent implements OnInit {
  
  form: FormGroup;  
  user:any;
  showCash: boolean = false;
  util = UtilFunc;
  public lastClose: Openclose = null;
  mode: string = 'open';
  title = {open: 'Open Register', close: 'Close Register'};

  categories:Producttype[] = [];
  outlet:any = [];
  salestax:any = [];
  category_summary_tabledata:any = [];
  tableData: any = [];  
  allData:any = [];

  // store policy setting
  batchReportStatus: boolean = false;
  paymentSummaryStatus: boolean = false;
  emailInventoryStatus: boolean = false;
  cigaretteSummaryStatus: boolean = false;
  notRevenueStatus: boolean = false; 
  salesPersonStatus: boolean = false;


  constructor(
    public store_policy:StorePolicy,
    private router: Router,
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    public openClose: Openclose,
    private dialog: MatDialog,
  ) { 
    this.authService.checkPremission('close_register');
    this.form = this.fb.group({      
      open_value: ['1', [Validators.required, Validators.min(1)]],
      open_note: ['']
    });
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void { 
    this.category_summary_tabledata = [];
    this.tableData = [];

    this.utilService.isSpinnerVisible = true;
    this.openClose.init();

    const query = {
        private_web_address: this.user.private_web_address, 
        outlet: this.user.outlet ? this.user.outlet._id : null,
        register: this.user.outlet.register[0]
    };
    if(!this.user.outlet) delete query.outlet;
    this.utilService.get('sell/openclose', query).subscribe(result => {
      if(result && result.body.length>0) {
        let c = result.body[0];
        if(c.status == 1) {          
          this.openClose.loadCurrent(() => {
            this.mode = 'close';
            this.utilService.isSpinnerVisible = false;
            this.getReportByCategories();
          }, () => {
            this.utilService.isSpinnerVisible = false;
          });
        } else {
          this.utilService.isSpinnerVisible = false;
          this.lastClose = new Openclose(this.authService, this.utilService);
          this.lastClose.init();
          this.lastClose.loadDetails(c);
        }
      } else {
        this.utilService.isSpinnerVisible = false;
      }
    }, error => {
      this.utilService.isSpinnerVisible = false;
      this.toastService.showFailed('Something went wrong. Try again later');
      this.router.navigate(['dashboard']);
    });

    this.loadOutlet();
    this.loadSalesTax();
    this.loadCategories();
    this.loadStorePolicy();    
  }

  ngAfterViewInit() {
    this.getReportByCategories();
  }

  save(){
    if(this.form.valid){
      const data = this.form.value;
      this.openClose.open_value = data.open_value;
      this.openClose.open_note = data.open_note;      
      this.openClose.save(() => {
        this.toastService.showSuccess(Constants.message.successOpenRegister);
        this.openClose.loadCurrent();        
        this.mode = 'close';
      }, error => {
        this.toastService.showFailedSave();
      })
    }
  }

  closeRegister(){
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '500px',
      data: {
        title: 'Close Register', 
        msg: 'Are you sure to close this register?',
        ok_button: 'OK',
        cancel_button: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'process') {        
        this.openClose.status = 2;        
        this.openClose.save(() => {
          this.toastService.showSuccess('Register Closed successfully.', 'Close Register');
          // this.router.navigate(['dashboard/sell/open-register']);
          this.openClose.init();
          this.category_summary_tabledata = [];
          this.tableData = [];
          this.mode = 'open';
        })
      } 
    });
  }

  loadCategories() {
    this.categories = [];
    let filter:any = [];
    filter.touch = true;
    if(this.cigaretteSummaryStatus){
      filter.cigarette = false;
    }
    if(this.notRevenueStatus) {
      // filter.revenue = false;
    }
    this.utilService.get('product/type', filter).subscribe(result => {
      if(result && result.body) {
        for(let t of result.body) {
          let type = new Producttype(this.authService, this.utilService);
          type.loadDetails(t);
          this.categories.push(type);
        }
      }      
    });
  }

  loadStorePolicy() {
    this.store_policy.load(()=>{
      this.batchReportStatus = this.store_policy.batch_settings.batch_report;
      this.paymentSummaryStatus = this.store_policy.batch_settings.payment_summary;
      this.emailInventoryStatus = this.store_policy.batch_settings.email_invertory;
      this.cigaretteSummaryStatus = this.store_policy.batch_settings.cigarette_summary;
      this.notRevenueStatus = this.store_policy.batch_settings.not_revenue;
      this.salesPersonStatus = this.store_policy.batch_settings.sales_person;
    });
  }

  loadOutlet() {
    this.outlet = [];
    this.utilService.get('sell/outlet').subscribe(result => {
      if(result) {
        for(let l of result.body) {
          this.outlet.push(l);
        }
      }
      console.log('outlet:', this.outlet);
    })
  }

  loadSalesTax() {
    this.salestax = [];
    this.utilService.get('sale/salestax').subscribe(result => {
      if(result && result.body) {
        for(let s of result.body) {
          this.salestax.push(s);
        }
      }
      console.log('salestax: ', this.salestax);
    })
  }

  public getTableData(callback?:Function):any {
    // this.loadCategories();
    this.loadTableData(callback);
  }

  async loadTableData(callback?:Function) {
    this.tableData = [];
    let filter = {      
        start: '',
        user_id: '',
        end: '',
      };

    if (this.mode == 'close') {
        filter.start = this.openClose.opening_time;
        filter.user_id = this.openClose.user._id;
      } else {
        console.log('return');
        return;
      }

      await this.utilService.get('sale/sale', filter).subscribe(result => {
        const data = result.body;
        console.log(data);
        if (result && result.body) {
          this.allData = [];
          for(let s of result.body) {
            for(let p of s.products) {
              // let index = this.categories.findIndex(item=>item == p.product_id.type);
              // if (index == -1) this.categories.push(p.product_id.type);
              this.allData.push(p);
            }
          }

          for(let c of this.categories) {
          let cData = this.allData.filter(item => item.product_id.type == c._id);
          if (cData.length > 0) {
            let totalQty = cData.reduce((a, b)=>a + b.qty, 0);
            
            let tax_rate = 0;            
            let lData = this.outlet.filter(item => item._id == cData[0].product_id.outlet);
            if(lData.length > 0) {
              let sData = this.salestax.filter(item => item._id == lData[0].defaultTax._id);
              if(sData.length > 0) {
                tax_rate = sData[0].rate;
              }
            }

            let price = cData[0].price + (cData[0].price * tax_rate / 100);
            let totalPrice = totalQty * price;

            let data = {
              name: c.data.name,
              sale_qty: totalQty,
              sale_sum:this.util.getPriceWithCurrency(totalPrice)
            };
            this.tableData.push(data);
          } else {
            let catname = this.categories.filter(item => item._id == c._id);
            let data = {
              name: c.data.name,
              sale_qty: 0,
              sale_sum: 0
            };
            this.tableData.push(data);
          }
        }
        if(callback) callback();
        }       
      });
  }

  getReportByCategories() {
    this.category_summary_tabledata = [];
    this.tableData = [];
    this.getTableData(()=>{
      this.category_summary_tabledata = this.tableData;
      console.log(this.category_summary_tabledata);
    });
  }



  get floatInput(): any {return this.form.get('open_value'); }
  get floatInputError(): string | void {    
    if (this.floatInput.hasError('required')) { return Constants.message.requiredField; }
    if (this.floatInput.hasError('min')) { return Constants.message.invalidMinValue.replace('?', Constants.open_value.min.toString()); }
  }  
}
