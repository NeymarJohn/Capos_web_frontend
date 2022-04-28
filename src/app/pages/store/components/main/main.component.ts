import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Settings, AppSettings } from '@app/pages/store/components/shared/services/color-option.service';
import {Product} from "../../modals/product.model";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarMenuService } from '../shared/sidebar/sidebar-menu.service';
import { SidenavMenu } from '../shared/sidebar/sidebar-menu.model';
import { APP_CONSTANTS, StoreConstants } from '@app/_configs/constant';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { ToastService } from '@app/_services/toast.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['../../../../../store.scss', './main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  public util = UtilFunc;
  public settings: Settings;
  public sidenavMenuItems:Array<any>;

  public currencies = StoreConstants.currencies;
  public currency:any;
  public flags = StoreConstants.flags;
  public flag:any;

  products: Product[];

  indexProduct: number;

  public banners = [];

  wishlistItems  :   Product[] = [];

  public url : any;

  navItems: SidenavMenu[] = StoreConstants.navItems;  

  constructor(
    public router: Router, 
    public sidenavMenuService:SidebarMenuService,
    public appSettings:AppSettings,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.settings = this.appSettings.settings;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    } )
  }

  ngAfterViewInit() {
    
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-deafult', '#' + StoreConstants.theme_color);
    this.checkValidStore();
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  checkValidStore() {
    if(APP_CONSTANTS.IS_FRONT) {
      let domain = this.util.getDomain();
      console.log(domain)
      this.utilService.get('auth/store', {domain_name: domain}).subscribe(result => {
        this.checkActiveStore(result);
      })
    } else {
      this.route.params.subscribe(params => {
        const private_web_address = params['private_web_address'];
        if(private_web_address) {
          this.utilService.get('auth/store', {private_web_address: private_web_address}).subscribe(result => {
            this.checkActiveStore(result);
          })
        } else {
          this.router.navigate(['error']);
        }
      })    
    }
  }

  checkActiveStore(result) {
    if(result && result.body) {
      let store = result.body;
      if(!store.active) {
        this.toastService.showFailed('This store is deactivated');
        this.router.navigate(['coming-soon']);    
      } else {
        this.utilService.private_web_address = store.private_web_address;
        if(store.theme_color) {
          document.documentElement.style.setProperty('--theme-deafult', '#' + store.theme_color);
        }
      }
    } else {
      this.router.navigate(['error']);
    }
  }

  public changeCurrency(currency){
    this.currency = currency;
  }
  public changeLang(flag){
    this.flag = flag;
  }
}
