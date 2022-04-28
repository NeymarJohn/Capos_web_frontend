import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.sass']
})
export class PriceComponent implements OnInit {

  enable:boolean = false;
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  // Using Output EventEmitter
  @Output() priceFilters = new EventEmitter();

  // define min, max and range
  public min : number = 100;
  public max : number = 1000;
  public range = [100,1000];

  constructor() { }

  ngOnInit() {  }

  // rangeChanged
  priceChanged(event:any) {
    setInterval(() => {
      this.priceFilters.emit(event);
    }, 1000);
  }

  setEnable() {
    this.priceFilter();
  }

  priceFilter() {
    let price = {
      priceFrom: this.priceFrom,
      priceTo: this.priceTo
    };
    if(!this.enable) {
      price.priceFrom = 0;
      price.priceTo = 0;
    }
    this.priceFilters.emit(price);
  }
}
