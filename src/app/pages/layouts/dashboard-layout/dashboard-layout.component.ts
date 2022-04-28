import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Constants} from '../../../_configs/constant';
import { AuthService } from '@app/_services/auth.service';
import { Store } from '@app/_classes/store.class';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['../../../../styles.scss', './dashboard-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;
  sidenavState = true;
  dashboardConfig = Constants.dashboardConfig;
  dashboardItems = [...Constants.dashboardItems];
  user:any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,    
    public store: Store
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 2000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    
  }

  ngOnInit() {
    this.store.load(() => {
      const private_web_address = this.store.private_web_address;
      const domain_name = this.store.domain_name;
      let index = this.dashboardItems.findIndex(item => item.label == 'Ecommerce');
      if(index>-1) {
        let ecommerce = this.dashboardItems[index];
        let index2 = ecommerce.items.findIndex(item => item.link.includes('/online-store/'));
        if(index2>-1) {
          // if(domain_name) {
          //   ecommerce.items[index2].link = location.protocol + '//' + domain_name;  
          // } else {
            ecommerce.items[index2].link = '/online-store/' + private_web_address;
          // }
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  selectedItem($event) {

  }
}
