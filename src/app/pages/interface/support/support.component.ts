import { Component, OnInit } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  util = UtilFunc;

  constructor() { }

  ngOnInit(): void {
    this.util.scrollToTop();
  }

}
