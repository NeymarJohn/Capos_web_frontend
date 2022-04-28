import { Component, OnInit } from '@angular/core';
import { Store } from '@app/_classes/store.class';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit {

  constructor(public store:Store, private sanitizer: DomSanitizer) {
    this.store.load();
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

  getGoogleMapUri() {
    let url = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50059.12775918716!2d72.78534673554945!3d21.16564923510817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1533793756956';
    if (this.store_address) {
      url = 'https://maps.google.com/maps?width=100%&height=600&hl=en&t=&z=14&ie=UTF8&iwloc=B&output=embed';
      url += '&q=' + this.store_address;
    }    
    let uri = this.sanitizer.bypassSecurityTrustResourceUrl(url);    
    return uri;
  }
}
