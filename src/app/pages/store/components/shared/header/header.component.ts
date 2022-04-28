import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '@app/pages/store/modals/product.model';
import { AppSettings, Settings } from '../services/color-option.service';
import { StoreConstants } from '@app/_configs/constant';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';
import { Store } from '@app/_classes/store.class';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public util = UtilFunc;
  public sidenavMenuItems:Array<any>;

  public currencies = StoreConstants.currencies;
  public currency:any;
  public flags = StoreConstants.flags;
  public flag:any;  

  products: Product[];

  indexProduct: number;
  public settings: Settings;
  logo_path: string = 'assets/images/logo-white.png';

  constructor(
    public utilService: UtilService, 
    public appSettings:AppSettings,
    public store_info: Store
  ) {
    this.settings = this.appSettings.settings;
    this.store_info.load(() => {
      if(this.store_info.logo) {
        this.logo_path = this.utilService.get_image(this.store_info.logo);
      }
    });
  }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  public changeCurrency(currency){
    this.currency = currency;
  }
  public changeLang(flag){
    this.flag = flag;
  }

}
