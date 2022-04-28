import { Component, OnInit } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  util = UtilFunc;

  constructor() { }

  ngOnInit(): void {
    this.util.scrollToTop();
  }

}
