import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from '@app/pages/dashboard/ecommerce/pages/blog/blog.component';
import { Store } from '@app/_classes/store.class';
import * as UtilFunc from '@app/_helpers/util.helper';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.sass']
})
export class BlogDetailsComponent implements OnInit {

  util = UtilFunc;
  blog:IBlog = null;
  
  constructor(
    public store:Store, 
    private router:Router, 
    private route:ActivatedRoute,
    private utilService: UtilService,
    private toastService: ToastService,
    private location:Location
  ) {
    this.store.load(()=>{
      if(!this.store.active_widget.blog) {
        this.router.navigate(['error']);
      } else {
        this.route.queryParams.subscribe(query => {
          if (query && query._id) {
            this.utilService.get('sale/blog', {_id: query._id}).subscribe(result => {
              if(result && result.body) {
                this.blog = result.body;
              } else {
                this.toastService.showFailed('No existing blog.');
                this.location.back();
              }
            }, error => {
              this.toastService.showFailed('No existing blog.');
              this.location.back();
            })
          } else {
            this.router.navigate(['error']);
          }
        });
      }
    }); 
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  getImagePath(path:string) {
    return this.utilService.get_image(path);
  }

}
