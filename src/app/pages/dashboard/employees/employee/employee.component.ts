import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@service/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {ExportToCsv} from 'export-to-csv';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import * as Util from '@helper/util.helper';
import {PayAccountDlgComponent} from '@page/dashboard/customers/customer/pay-account-dlg/pay-account-dlg.component';
import { Customer } from '@app/_classes/customer.class';
import { Cart } from '@app/_classes/cart.class';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmployeeComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  util = Util;
  customerSearchForm: FormGroup;
  user: any;
  dataSource: any;
  columnsToDisplay = ['expand', 'name', 'email', 'groupId', 'credit', 'balance', 'action'];
  labelToDisplay = {expand: '', name: 'Name', email: 'Email', groupId: 'Group', credit: 'Store Credit', balance: 'Balance', action: ''};
  columnsToSpecify = ['expand', 'groupId', 'credit', 'balance', 'action'];
  expandedElement: any | null;
  searchVal = '';
  groups = [];
  customers = [];
  countries = [];
  permission:boolean = false;
  permission_export:boolean = false;

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Employees',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    filename: 'employees'
  };
  private property = '';
  private value = '';
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private route: Router,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
  ) {
    this.router.queryParams.subscribe(data => {
      if (data && data.property) {
        const {property, value} = data;
        this.property = property;
        this.value = value;
      }
    });
    this.customerSearchForm = this.fb.group({
      groupId: [''],
      country: ['']
    });

    this.authService.currentUser.subscribe(user => {      
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('add_customer') && this.user.role.permissions.includes('remove_customer');
        this.permission_export = this.user.role.permissions.includes('export_customer');
      }
    });
  }

  ngOnInit(): void {
    // Search form
    this.countries = [{_id: '', country_name:'All Countries'}];
    this.countries = this.countries.concat(this.utilService.countries);    

    this.groups = [{_id: '', name:'All Group'}];
    const dataGroup = {mode:'employee'};
    this.utilService.get('customers/group', dataGroup).subscribe(result => {      
      this.groups = this.groups.concat(result.body);
    });
    this.initCustomer();
  }

  initCustomer(): void {    
    this.utilService.get('customers/employee', {}).subscribe(result => {      
      this.initCustomerTable(result);
    });
  }

  initCustomerTable(result): void {
    for(let r of result.body) {
      const c = new Customer(this.authService, this.utilService);
      c.type = 'employee';
      c.loadDetails(r);
      this.customers.push(c);
    }
    if(this.customers==undefined || this.customers==null)
      this.customers=[];
    this.dataSource = new MatTableDataSource(this.customers);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;     
  }


  import(): void {
    this.route.navigate(['/dashboard/employees/employee-import']);
  }

  handleAction(action, customer: any = ''): void {
    if (action === 'add') {
      this.route.navigate(['/dashboard/employees/employee-action']);
    }
    else if (action === 'edit') {
      this.route.navigate(['/dashboard/employees/employee-action'], {queryParams: {id: customer._id}});
    } else if (action === 'delete') {
      const data = {action, item: 'employee'};
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '600px',
        data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action) {
          customer.delete(() => {
            this.toastService.showSuccessRemove();
            let index = this.customers.findIndex(item => item._id == customer._id);            
            this.customers.splice(index, 1);            
            this.dataSource = new MatTableDataSource(this.customers);
          }, () => {
            this.toastService.showFailedRemove();
          })
        }
      });
    }
  }

  exportList(): void {    
    const customers = this.customers.map(customer => {
      const result = {};
      const data = customer;
      data['groupId'] = data.groupId._id;
      const physicalAddress = customer.postal_address, physical_address = {};
      Object.keys(physicalAddress).forEach(key => {
        let v = physicalAddress[key];
        if(key == 'country') v = v._id;
        physical_address['physical_address_' + key] = v;
      })
      delete data.physical_address;

      const postalAddress = customer.postal_address, postal_address = {};
      Object.keys(postalAddress).forEach(key => {        
        let v = postalAddress[key];
        if(key == 'country') v = v._id;
        postal_address['postal_address_' + key] = v;
      })
      delete data.postal_address;

      const customInformation = customer.custom_information;
      const custom_information = {};
      if(typeof customInformation != 'undefined') {        
        Object.keys(customInformation).forEach(key => {        
          custom_information['custom_information_' + key] = customInformation[key];
        })
        delete data.custom_information;
      }      
      
      Object.assign(result, {...data});
      Object.assign(result, {...physical_address});
      Object.assign(result, {...postal_address});
      if(typeof customInformation != 'undefined') {
        Object.assign(result, {...custom_information});
      }
      return result;
    });
    const exportToCsv = new ExportToCsv(this.options);
    exportToCsv.generateCsv(customers);
  }

  filterCustomer(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  searchCustomer(): void {
    const data = this.customerSearchForm.value;
    data.range = 'all-factor'; 
    this.utilService.get('customers/employee', data).subscribe(result => {      
      this.initCustomerTable(result);
    });
  }


  toggleStatus(event, product): void {
    event.stopPropagation();
    const data = {field: 'enabled', id: product.id, value: !product.enabled};
    this.utilService.put('customers/employee', data).subscribe(result => {
      this.toastService.showSuccess('Employee - ' + product.name + ' switched successfully', 'Switch status');
    });
  }

  clearFilter(): void {
    //this.customerSearchForm.reset();
    this.searchVal = '';
    this.customerSearchForm = this.fb.group({
      groupId: [''],
      country: ['']
    });
    this.initCustomer();
  }

  viewSale(customer): void {
    this.route.navigate(['/dashboard/sell/sales-history'], {queryParams: {customer: customer._id}});
  }

  payAccount(customer): void {
    const dialogRef = this.dialog.open(PayAccountDlgComponent, {
      width: '600px',
      data: {outlet: this.user.outlet ? this.user.outlet._id : null, customer: customer}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'pay') {
        const sale:Cart = result.sale;        
        sale.pay(result.pay_mode, result.amount);
        sale.sale_status += '_completed';
        sale.save(() => {
          customer.temp.debit = -result.amount;          
          if(result.pay_mode == 'store_credit') {                            
            customer.temp.credit = -result.amount;
            customer.temp.total_redeemed = Math.abs(result.amount);            
          }
          customer.save(() => {
            this.toastService.showSuccess('Account balance was paid successfully.');
          });
        })
      }
    });
  }
}
