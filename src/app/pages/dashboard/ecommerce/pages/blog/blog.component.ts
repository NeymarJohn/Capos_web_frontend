import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@app/_classes/store.class';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { Router } from '@angular/router';
import * as UtilFunc from '@app/_helpers/util.helper';
import { BlogDataSource } from '@app/_services/blog.datasource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface IBlog {
  _id: string,
  private_web_address: string,
  title: string,
  content: string,
  user: any,
  image: string,
  created_at: string
}

@Component({
  selector: 'app-ecommerce-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {
  
  util = UtilFunc;  
  blogDatasource: BlogDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(
    public store: Store,
    private utilService: UtilService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.store.load(() => {
      
    });
    this.blogDatasource = new BlogDataSource(this.utilService);   
  }

  ngOnInit(): void {
    this.searchBlogs();
  }

  ngAfterViewInit() {          
    this.paginator.page.subscribe(
        (value:PageEvent) => {
          this.searchBlogs();
        }
    );         
  }

  searchBlogs() {        
    let pageIndex = this.paginator? this.paginator.pageIndex: 0;
    let pageSize = this.paginator? this.paginator.pageSize: 10;
    this.blogDatasource.loadBlogs({}, pageIndex, pageSize);  
  }

  save() {
    this.store.save(() => {
      this.toastService.showSuccessSave();
    });
  }

  add() {
    this.router.navigate(['/dashboard/ecommerce/pages/add-blog'], {queryParams: {_id: ''}});
  }

  edit(_id: string) {
    this.router.navigate(['/dashboard/ecommerce/pages/add-blog'], {queryParams: {_id: _id}});
  }

  delete(_id: string) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Blog'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {    
        this.utilService.delete('sale/blog?_id=' + _id).subscribe(result => {
          this.searchBlogs();
          this.toastService.showSuccessRemove();
        })
      }
    });
  }

  getImagePath(path) {
    return this.utilService.get_image(path);
  }
}
