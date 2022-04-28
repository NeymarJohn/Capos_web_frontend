import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';
import { BlogDataSource } from '@app/_services/blog.datasource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UtilService } from '@app/_services/util.service';
import { IBlog } from '@app/pages/dashboard/ecommerce/pages/blog/blog.component';
import { Router } from '@angular/router';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.sass']
})
export class BlogListComponent implements  OnInit, AfterViewInit {

  util = UtilFunc;
  blogDatasource: BlogDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  keyword:string = '';
  
  constructor(private utilService: UtilService, private router:Router, public store :Store) {    
    this.store.load(()=>{
      if(!this.store.active_widget.blog) {
        this.router.navigate(['error']);
      }
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
    let filter = {keyword: this.keyword};
    let pageIndex = this.paginator? this.paginator.pageIndex: 0;
    let pageSize = this.paginator? this.paginator.pageSize: 10;
    this.blogDatasource.loadBlogs(filter, pageIndex, pageSize);  
  }

  showBlog(blog:IBlog) {
    let url = this.util.getRouterLink('/blog-details');
    this.router.navigate(url, {queryParams: {_id: blog._id}});
  }

  getImagePath(path) {
    return this.utilService.get_image(path);
  }
}
