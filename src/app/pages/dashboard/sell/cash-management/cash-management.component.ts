import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '@app/_services/toast.service';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { EditCashComponent } from './edit-cash/edit-cash.component';
import {UtilService} from '@service/util.service';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from '@service/auth.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import * as UtilFunc from '@helper/util.helper';
import { CashDataSource } from '@app/_services/cash.datasource';

@Component({
  selector: 'app-cash-management',
  templateUrl: './cash-management.component.html',
  styleUrls: ['./cash-management.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CashManagementComponent implements OnInit, AfterViewInit {  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;  

  keyword='';
  user:any;
  cash=[];
  dataSource: CashDataSource;
  columnsToDisplay = ['created_at', 'user_id', 'register', 'reasons', 'is_credit', 'transaction', 'action'];
  sort = {
    sort_field: 'created_at',
    sort_order: -1
  };
  util = UtilFunc;
  main_outlet: any;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService
  ) { 
    this.dataSource = new CashDataSource(this.utilService);
    this.authService.checkPremission('cash_management');
    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });
    this.utilService.get('sell/outlet', {is_main: true}).subscribe(result => {
      if(result && result.body) {
        this.main_outlet = result.body[0];
      }
    })
  }

  ngOnInit(): void {
    this.search();    
  }

  ngAfterViewInit() {
    this.paginator.page
      .subscribe(
        (value:PageEvent) => {
          this.search();
        }
      );
  }

  search(): void {    
    const filter = {
      outlet: null,
      register: null,
      sort_field: this.sort.sort_field,
      sort_order: this.sort.sort_order
    };        
    if(this.user.outlet) {
      filter.outlet = this.user.outlet._id;
      filter.register = this.user.outlet.register[0];
    } else if(this.main_outlet) {
      filter.outlet = this.main_outlet._id;
      filter.register = this.main_outlet.register[0];
    } 
    let page = this.paginator.pageIndex, size = this.paginator.pageSize;
    if(typeof page =='undefined') page = 0;
		if(!size) size = 10;    
    this.dataSource.load(filter, page, size);      
  }
  
  addCash(){
    const dialogRef = this.dialog.open(EditCashComponent, {
      width: '600px',
      height: 'auto',
      data: {
        cash: {
          date: '',
          user: '',
          reasons: '',
          transaction: 1,
          is_credit: '1'
        }, 
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {   
      if(result){
        this.search();
      }
    });
  }

  editCash(cash){
    const dialogRef = this.dialog.open(EditCashComponent, {
      width: '600px',
      height: 'auto',
      data: {
        cash: cash, 
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.search();
      }
    });
  }

  deleteCash(cash){
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: 'Cash'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        //TODO: delete cash data
        this.utilService.delete('sell/cash?_id=' + cash._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.search();
        }, error => {
          this.toastService.showFailedRemove();
        });   
      }
    });
  }

  showCreditLabel(is_credit) {
    if(is_credit == '1') {
      return 'Credit';
    } else {
      return 'Debit';
    }
  }

  showTransactions(cash) {
    let amount = cash.transaction, is_credit = cash.is_credit;
    amount = '$' + amount;
    if(is_credit == '1') {
      amount = '+ ' + amount;
    } else {
      amount = '- ' + amount;
    }
    return amount;
  }

  onSort(event) {
    this.sort.sort_field = event.active;
    this.sort.sort_order = event.direction == 'desc'? -1: 1;    
    this.search();
  }
}
