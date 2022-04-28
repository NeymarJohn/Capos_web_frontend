import { Component, OnInit } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['../../../store.scss', './error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  util = UtilFunc;
  constructor() { }

  ngOnInit() {
  }
}
