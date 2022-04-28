import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '@app/_services/auth.service';
import {UtilService} from '@app/_services/util.service';
import {ToastService} from '@app/_services/toast.service';
import {TagDlgComponent} from './tag-dlg/tag-dlg.component';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.scss']
})
export class ProductTagComponent implements OnInit {
  columnToDisplay = ['name' , 'products', 'action'];
  columnToSpecify = ['products', 'action'];
  dataSource: any;
  user: any;
  tags = [];
  searchVal: string;
  util = UtilFunc;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private route: Router,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.initTagTable();
  }

  initTagTable(): void {
    this.utilService.get('product/tag', {}).subscribe(result => {
      this.tags = result.body;
      this.dataSource = new MatTableDataSource(this.tags);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  addTag(): void {
    const dialogRef = this.dialog.open(TagDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: {name: ''}, action: 'add', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        this.initTagTable();
      }
    });
  }

  editTag(item): void {
    const dialogRef = this.dialog.open(TagDlgComponent, {
      width: '600px',
      height: 'auto',
      data: {item: item, action: 'edit', user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTagTable();
      }
    });
  }

  searchTag(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  viewProducts(element: any): void {
    this.route.navigate(['/dashboard/product'], {queryParams: {property: 'tag', value: element.name}});
  }

  deleteTag(item){
    const warning_msg = (item.products > 0) ? item.products + ' product(s) contain this tag.':'';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        warning_msg: warning_msg,
        action: 'delete',
        item: 'Product Tag'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        const url = 'product/tag?_id=' + item._id;
        this.utilService.delete(url).subscribe((res) => {
          this.initTagTable();
          this.toastService.showSuccessRemove();
        }, err => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }
}
