import { Component, OnInit } from '@angular/core';
import { Store } from '@app/_classes/store.class';
import * as UtilFunc from '@app/_helpers/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  public util = UtilFunc;
  public categories = [];

  constructor(
    private utilService: UtilService,
    public store: Store
  ) {
    this.store.load();
  }

  ngOnInit() {
    this.utilService.get('product/type', {}).subscribe(result => {
      if(result && result.body) {
        this.categories = result.body;
      }
    })
  }

  openMegaMenu(){
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }
    });
  }
}
