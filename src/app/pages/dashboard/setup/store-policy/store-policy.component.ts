import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-store-policy',
  templateUrl: './store-policy.component.html',
  styleUrls: ['./store-policy.component.scss']
})
export class StorePolicyComponent implements OnInit {
  navs=[
    {
      name: 'Modules',
      link: 'modules'
    },
    {
      name: 'Print',
      link: 'print'
    },
    {
      name: 'Batch/Cashier Closing',
      link: 'batch_cashier_closing'
    },
    {
      name: 'Others',
      link: 'others'
    },
    {
      name: 'System',
      link: 'system'
    },
    {
      name: 'Employee/Timesheet',
      link: 'employee_timesheet'
    }
  ];  
  constructor(private authService: AuthService) { 
    this.authService.checkPremission('setup_general')
  }

  ngOnInit(): void {
  }

}