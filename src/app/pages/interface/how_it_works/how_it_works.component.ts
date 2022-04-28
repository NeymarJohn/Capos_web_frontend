import { Component, OnInit } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how_it_works.component.html',
  styleUrls: ['./how_it_works.component.scss']
})
export class HowItWorksComponent implements OnInit {

  util = UtilFunc;

  constructor() { }

  ngOnInit(): void {
    this.util.scrollToTop();
  }

}
