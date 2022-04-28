import { Component, OnInit, Input } from '@angular/core';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.sass']
})
export class BreadcrumbComponent implements OnInit {
  @Input() title : string;
  @Input() breadcrumb : string;
  util = UtilFunc;
  
  constructor() { }

  ngOnInit(): void {
  }

}
