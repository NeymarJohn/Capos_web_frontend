import { Component, OnInit } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  util = UtilFunc;

  constructor() { }

  ngOnInit(): void {
    this.util.scrollToTop();
  }

}
