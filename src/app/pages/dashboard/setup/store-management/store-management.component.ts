import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.scss']
})
export class StoreManagementComponent implements OnInit {

  navs=[
    {
      name: 'Payment',
      link: 'payment'
    },
    {
      name: 'Receipt',
      link: 'receipt'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
