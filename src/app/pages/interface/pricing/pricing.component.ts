import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '@app/_configs/constant';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  
  plans = Constants.plans;
  constructor(
    private router: Router,
  ) {    
  }

  ngOnInit(): void {
  }

  startPlan() {
    this.router.navigateByUrl('/auth/sign-up')
  }
}
