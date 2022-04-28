import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/_services/util.service';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.sass']
})
export class BannersComponent implements OnInit {

  @Input('banners') banners: Array<any> = [];
  contentLoaded = false;
  util = UtilFunc;

  constructor(
    private utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

  public getBanner(index){
    return this.banners[index];
  }

  public getBgImage(index){
    let bgImage = {
      'background-image': "url(" + this.utilService.get_banner_image(this.banners[index].image, index) + ")"
    };
    return bgImage;
  }

  gotoLink(index:number) {
    let banner = this.getBanner(index);
    if(banner.href) {
      this.router.navigate(this.util.getRouterLink(banner.href));
    }
  }
}
