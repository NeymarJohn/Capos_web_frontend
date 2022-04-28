import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '@app/_services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import { EditSalesTaxComponent } from './edit-sales-tax/edit-sales-tax.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-sales-taxes',
  templateUrl: './sales-taxes.component.html',
  styleUrls: ['./sales-taxes.component.scss']
})
export class SalesTaxesComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  pageData = [];
  salesTaxColumns=['name', 'rate', 'action'];
  user: any;
  dataSource: any;
  permission:boolean = false;
  showTitle:boolean = true;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {     
    this.showTitle = !this.router.url.includes('ecommerce');    
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('manage_payment_type');
      }
    });
  }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {    
    this.utilService.get('sale/salestax', {}).subscribe(result => {           
      if(result && result.body) {     
        this.pageData = result.body;           
      } else {
        this.pageData = [];
      }
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });    
  }

  addSalesTaxes(){
    const dialogRef = this.dialog.open(EditSalesTaxComponent, {
      width: '600px',
      height: 'auto',
      data: {
        tax: {
          name: '',
          rate: 0,
        }, 
        user: this.user,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();        
      }
    });
  }

  
  deleteTax(item){
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: 'Sales Tax'
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='delete') {        
        this.utilService.delete('sale/salestax?_id=' + item._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

  editTax(item){
    const dialogRef = this.dialog.open(EditSalesTaxComponent, {
      width: '600px',
      height: 'auto',
      data: {
        tax: item, 
        user: this.user,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();       
      }
    });
  }
}
