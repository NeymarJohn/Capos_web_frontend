import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss']
})
export class SalesHistoryComponent implements OnInit {
  navs=[
    {
      name: 'All',
      link: 'all'
    },
    {
      name: 'Process Return',
      link: 'process-return'
    },
    {
      name: 'Continue Sale',
      link: 'continue-sale'
    }
  ];

  constructor(private authService: AuthService) {
    this.authService.checkPremission('sales_history');
  }

  ngOnInit(): void {
  }

}
