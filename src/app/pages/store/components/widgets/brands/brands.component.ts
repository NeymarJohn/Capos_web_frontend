import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from '@app/_services/util.service';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.sass']
})
export class BrandsComponent implements OnInit {
  //brands: string[] = ['all', 'Brand-1', 'Brand-2', 'Brand-3', 'Brand-4', 'Brand-5'];
  brands = [];

  @Output() brandChanged = new EventEmitter();
  constructor(private utilService: UtilService) { }

  ngOnInit() {
    this.utilService.get('product/brand', {}).subscribe(result => {
      if(result && result.body) {
        this.brands = result.body;
      }
    })
  }

  brandSelect(event) {
    this.brandChanged.emit(
      event.value
    );
  }

}
