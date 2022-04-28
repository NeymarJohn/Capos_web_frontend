import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { IBanner } from '@app/_classes/store.class';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.sass']
})
export class MainCarouselComponent implements OnInit {

  @Input('slides') slides: Array<IBanner> = [];
  public config: SwiperConfigInterface = {};
  util = UtilFunc;

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  constructor(private utilService: UtilService, private router: Router) { }

  ngOnInit() {
  
  }

  ngAfterViewInit(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      initialSlide: 5,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide"
    }
  }

  getImagePath(path:string, index:number) {    
    return this.utilService.get_slider_image(path, index);
  }

  gotoLink(href:string) {
    if(href) {
      this.router.navigate(this.util.getRouterLink(href));
    }
  }
}
