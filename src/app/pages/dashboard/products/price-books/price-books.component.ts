import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import { MatDialog } from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { ToastService } from '@app/_services/toast.service';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { EditPriceBookComponent } from './edit-price-book/edit-price-book.component';
import {MatTableDataSource} from '@angular/material/table';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-price-books',
  templateUrl: './price-books.component.html',
  styleUrls: ['./price-books.component.scss']
})
export class PriceBooksComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  columnToDisplay = ['name' , 'groupId', 'outletId', 'validFrom', 'validTo', 'action'];
  headers = {name: 'Name', groupId: 'Customer Group', outletId: 'Outlet', validFrom: 'Valid From', validTo: 'Valid To', action: 'Action'};
  columnsToSpecify = ['groupId', 'outletId', 'validFrom', 'validTo', 'action'];
  dataSource: any;
  user: any;
  pageData = [];
  util = UtilFunc;
  permission:boolean = false;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private authService: AuthService,
    private utilService: UtilService

  ) { 
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('create_price_books');
      }
    });
  }

  ngOnInit(): void {
    this.initPriceBook();
  }

  initPriceBook(): void {    
    this.utilService.get('product/price_book',{}).subscribe(result => {           
      this.initTable(result);
    });    
  }
  initTable(result): void {    
    const books = [];
    if(result.body) {
      this.pageData = result.body;    
      this.pageData.forEach(book => {
        if(typeof book.groupId == 'undefined' || book.groupId == null) {
          book.groupId = {name: 'All Customers', _id: '0'};
        }
        if(typeof book.outletId == 'undefined' || book.outletId == null) {
          book.outletId = {name: 'Main Outlet', _id: '0'};
        }

        if(typeof book.bookFile == 'undefined' || book.bookFile == null) {
          book.bookFile = '';
        } else {
          book.bookFile = book.bookFile.replace(/^.*[\\\/]/, '');
        }

        books.push({
          _id: book._id , name: book.name, groupId: book.groupId, outletId: book.outletId, validFrom: this.util.handleDate(book.validFrom),
          validTo: this.util.handleDate(book.validTo), bookFile: book.bookFile});
      });    
    }
    this.dataSource = new MatTableDataSource(books);
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.matPaginator;
  }

  downloadBookFile(filename) {
    this.utilService.get_csvfile(filename);
  }

  addPriceBook(){
    const dialogRef = this.dialog.open(EditPriceBookComponent, {
      width: '600px',
      height: 'auto',
      data: {
        pb: {
          name: '',
          groupId: {_id: '0'},
          outletId: {_id: '0'},
          validFrom: '',
          validTo: '',
          bookFile: '',
        },
        action: 'add',
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if(result) {
        this.initPriceBook();
      }
    });
  }

  deletePriceBook(book){
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px', 
      data: {
        action: 'delete',
        item: 'Price Book'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        //TODO: delete order data
        this.utilService.delete('product/price_book?_id=' + book._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initPriceBook();
        }, error => {
          this.toastService.showFailedRemove();
        });         
      }
    });
  }

  editPriceBook(book){
    const dialogRef = this.dialog.open(EditPriceBookComponent, {
      width: '600px',
      height: 'auto',
      data: {
        pb: book,
        action: 'edit',
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.initPriceBook();
      }
    });
  }
}
