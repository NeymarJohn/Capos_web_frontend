import { Component, OnInit } from '@angular/core';
import { Store } from '@app/_classes/store.class';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  util = UtilFunc;
  logo_path: string = 'assets//images/logo-02-01.png'; 

  constructor(public store: Store, public utilService: UtilService) {
    this.store.load(() => {
      if(this.store.logo) {
        this.logo_path = this.utilService.get_image(this.store.logo);
      }
    });
  }

  ngOnInit() {
    
  }

  public get store_address():string {
    let address = '';
    if(this.store.physical_address) {
      address += this.store.physical_address.street;
      if(this.store.physical_address.city) {
        address += ', ' + this.store.physical_address.city;
      }
      if(this.store.physical_address.state) {
        address += ', ' + this.store.physical_address.state;
      }
      if(this.store.physical_address.postcode) {
        address += ' ' + this.store.physical_address.postcode;
      }
      if(this.store.physical_address.country) {
        address += ', ' + this.store.physical_address.country.country_name;
      }
    }
    return address;
  }

}
