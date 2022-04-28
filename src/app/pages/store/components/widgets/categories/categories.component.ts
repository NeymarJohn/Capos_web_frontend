import { Component, OnInit, Input } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit {
  util = UtilFunc;
  categories = [];
  @Input() category:string;

  constructor(private utilService: UtilService) { }

  ngOnInit() {
    this.utilService.get('product/type', {touch: true}).subscribe(result => {
      if(result && result.body) {
        let sum = 0;
        for(let c of result.body) {
          sum += c.products;
        }
        this.categories.push({slug: 'all', name: 'Show All', products: sum});
        this.categories = this.categories.concat(result.body);
      }      
    })
  }

  getCategory(slug:string):string {
    if(slug == 'all') return 'All';
    let index = this.categories.findIndex(item => item.slug == slug);
    if(index>-1) {
      return this.categories[index].name;
    }
    return '';
  }

}
